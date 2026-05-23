const Product = require('../model/product')
const {uploadOnS3} = require('../utils/s3utils')
// const cloudinary = require('../config/cloudinary')
const { model } = require('mongoose')



const getProducts = async (req, res) =>{

    try {
    const products = await Product.find({})
    res.json(products)
    } catch (error) {
    res.status(500).json({message: "sever error"})
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (product) {
            res.json(product)
        } else {
            res.status(500).json({message: "product not founf"})
        }

    } catch (error) {
        res.status(500).json({message: "sever error"})
    }
}

const createProduct = async (req, res) => {

   try {
       console.log("body", req.body);
       console.log("file", req.file);
       
     const {name, description, price, category, stock} = req.body
 
     let imageurl = ""
     if (req.file && req.file.path) {
        
        //  const result = await cloudinary.uploader.upload(req.file.path)
         const result = await uploadOnS3(req.file.path)
         console.log(result);
         
         imageurl = result.secure_url
     }

     const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        imageurl
     })

     const savedProduct = await product.save()
     res.status(200).json(savedProduct)

    } catch (error) {
        
     res.status(500).json({message: 'sever error'})
    }
 }

 const updateProduct = async (req, res) => {
    try {
        const {name, description, price, category, stock} = req.body
        const product = await Product.findById(req.params.id)

        if (product) {
            product.name = name || product.name
            product.description = description || product.description
            product.price = price || product.price
            product.category = category || product.category
            product.stock = stock || product.stock

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.File.path)
               
                product.imageurl = result.secure_url
                
            }
            const updateProduct = await product.save()
            res.json(updateProduct)
        }else { 
            res.status(404).json({message: "product not found"})
        }
    } catch (error) {
        res.status(500).json({message: "sever error"})
    }
 }

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (product) {
            await product.deleteOne()
            res.json({message: 'product deleted'})
        }
    } catch (error) {
        res.status(500).json({message: 'sever error'})
    }
}

module.exports = {
    getProducts,
    getProductById, 
    createProduct,
    updateProduct,
    deleteProduct
}



