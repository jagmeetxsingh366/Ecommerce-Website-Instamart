import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async(req , res) => {
    try {
        
        const {name} = req.body;
        if(!name){
            return res.status(401).send({
                message : 'Name is required'
            })
        }

        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success : true,
                message : 'Category already exists'
            })
        }

        const category = await categoryModel({name  , slug : slugify(name)}).save();
        return res.status(201).send({
            success : true,
            message : 'Category created successfully',
            category
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success : false,
            error,
            message : "Error in creating category"
        })
    }
}

export const updateCategoryController = async (req , res) => {
    try {

        const {name} = req.body;
        const {id} = req.params;

        const category = await categoryModel.findByIdAndUpdate(id , {name , slug : slugify(name)}, {new : true});
        res.status(200).send({
            success : true,
            message : 'Category updated successfully',
            category 
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            error,
            message : "Error in updating category"
        })
    }
}

export const getCategoryController = async (req , res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success : true,
            message : 'Category fetched successfully',
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            error,
            message : "Error in fetching category"
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try{
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        return res.status(200).send({
            success : true,
            message : 'Category deleted successfully',
            category
        })
    }catch(err){
        return res.status(500).send({
            success : false,
            error,
            message : "Error in deleting category"
        })
    }
}

export const singleCategoryController = async(req , res) => {
    try{
        const category = await categoryModel.findOne({slug : req.params.slug});
        return res.status(200).send({
            success : true,
            message : 'Single Category fetched successfully',
            category
        })
    }catch(error) {
        return res.status(500).send({
            success : false,
            error,
            message : "Error in fetching Single category"
        })
    }
}