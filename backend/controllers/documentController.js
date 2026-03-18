import Document from '../models/Document.js';
import Flashcard from '../models/FlashCard.js'
import Quiz from '../models/Quiz.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { chunkText } from '../utils/textChunker.js'
import fs from 'fs/promises'
import mognoose from 'mongoose'

export const uploadDocument = async (req, res, next) => {
    try {

    }
    catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => { });
        }
        next(error)
    }
}

export const getDocuments = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error)
    }
}

export const getDocument = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error)
    }
}

export const deleteDocument = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error)
    }
}

export const updateDocument = async (req, res, next) => {
    try {

    }
    catch (error) {
        next(error)
    }
}