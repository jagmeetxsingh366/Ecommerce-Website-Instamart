import slugify from 'slugify';
import productModel from '../models/productModel.js';
import fs from 'fs';
import braintree from 'braintree';
import orderModel from '../models/orderModel.js';
import categoryModel from '../models/categoryModel.js';
import dotenv from 'dotenv';

dotenv.config();


var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
  });

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case photo && photo.size > 2000000:
                return res.status(500).send({ error: 'Photo is required and size should be less than 20mb' });
        }

        const products = await productModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        res.status(200).send({
            success: true,
            message: "Product created successfully",
            products
        });

    } catch (erorr) {
        console.log(erorr);
        return res.status(500).send({
            message: "Error in creating product",
            success: false,
            error
        })
    }
}

export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({}).select('-photo').populate('category').limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Products fetched successfully",
            products,
            totalCount: products.length
        });
    } catch (erorr) {
        console.log(erorr);
        return res.status(500).send({
            success: false,
            error: erorr,
            message: "Error in getting products",
        });
    }
}

export const getSingleProductController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('-photo').populate('category');
        return res.status(200).send({
            success: true,
            message: "Product fetched successfully",
            product,
        })
    } catch (erorr) {
        console.log(erorr);
        return res.status(500).send({
            success: false,
            error: erorr,
            message: "Error in getting single product",
        });
    }
}

export const getProductPhotoController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.pid).select('photo');
        if (product.photo.data) {
            res.set('Content-Type', product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            error,
            message: "Error in getting product photo",
        });
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const product = await productModel.findByIdAndDelete(req.params.pid);
        return res.status(200).send({
            success: true,
            message: "Product deleted successfully",
            product,
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            error,
            message: "Error in deleting product",
        });
    }
}

export const updateProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case photo && photo.size > 2000000:
                return res.status(500).send({ error: 'Photo is required and size should be less than 20mb' });
        }

        const products = await productModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            products
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: "Error in updating product",
        });
    }
}

export const productFilterController = async (req, res) => {
    try {

        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) {
            args.category = checked;
        }

        if (radio.length > 0) {
            args.price = { $gte: radio[0], $lte: radio[1] };
        }
        const products = await productModel.find(args).select('-photo');
        return res.status(200).send({
            success: true,
            message: "Products fetched successfully",
            products,
            totalCount: products.length
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            error,
            message: "Error in filtering products",
        });
    }

}


export const getProductPageController = async (req, res) => {
    try {
        const { page } = req.params;
        const perPage = 6;
        const products = await productModel.find({}).select('-photo').skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: 'products fetched successfully',
            products,
            length: products.length
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error,
            message: 'error in fetching products',
            success: false
        })
    }
}

export const getProductLengthController = (req, res) => {
    try {
        const productLength = productModel.find({}).select('-photo').length;
        return res.status(200).send({
            success: true,
            productLength,
            message: 'product length'
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Product length cant be sent',
            error
        });
    }
}

export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const products = await productModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        }).select('-photo');

        return res.status(200).send({
            products,
            success: true,
            message: 'products fetched successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in fetching products',
            error
        })
    }
}

export const relatedProductController = async (req, res) => {
    try{
        const { pid, cid } = req.params;
        const products = await productModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(3).populate('category');
        return res.status(200).send({
            success: true,
            products,
            message: 'products fetched successfully'
        });
    }catch(error){
        return res.status(500).send({
            success: false,
            message: 'error in fetching products',
            error
        })
    }
} 

export const braintreeTokenController = async (req , res) => {
    try{
        gateway.clientToken.generate({} , (err , response) => {
            if(err){
                res.status(500).send({err});
            }else{
                res.send(response);
            }
        })
    }catch(error){  
        console.log(error);
    }
};

export const briantreePaymentController = async (req , res) => {
    try {
        const {cart , nonce} = req.body;
        let total = 0;
        cart.map((item) => {total += item.price});
        let newTransaction = gateway.transaction.sale({
            amount : total,
            paymentMethodNonce : nonce,
            options : {
                submitForSettlement : true,
            }
        }, (error , result) => {
            if(result){
                const order = new orderModel({
                    products : cart,
                    payment : result,
                    buyer : req.user._id
                }).save();
                return res.json({ok : true});
            }else{
                console.log(error);
                return res.status(500).send(error);
            }
        })
    }catch(error){
        console.log(error);
    }
}


export const CategoryProductController = async (req , res) => {
    try{    
        const category = await categoryModel.findOne({slug : req.params.slug});
        console.log(category);
        const products = await productModel.find({category}).populate('category');
        res.status(200).send({
            success : true,
            category,
            products
        })
    }catch(err){
        console.log(err);
        res.status(500).send({
            success : false,
            err,
            message : 'error while getting category product'
        })
    }
}