import express from "express"
import PostMessage from "../models/moongoseSchema.js";
import mongoose from 'mongoose';

export const getPosts = async (req, res) => {
    try{
        const posts = await PostMessage.find();
        res.status(200).send(posts);
    } catch(err){
        res.status(404).statusMessage(err);
    }
}

export const createPost = async (req, res) => {
    const {title, message, creator, tags, selectedFile} = req.body;
    const newPostMessage = new PostMessage({title, message, creator, tags, selectedFile} );
    try {
        await newPostMessage.save();

        res.status(201).json({newPostMessage});
    }catch(err){
        res.status(409).json({message: err.message});
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    const { likeCount } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    const updatedPost = {title, message, creator, selectedFile, tags, likeCount: likeCount + 1, _id: id };

    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

    res.json(updatedPost);
}

export const deletePost = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await PostMessage.findByIdAndDelete(id);

    res.status(200).send('Post Deleted Succesfully');
}