import { YoutubeTranscript } from 'youtube-transcript';
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro"});


/***************************************************************
 * @GET_VIDEO_SUMMARY
 * @REQUEST_TYPE GET
 * @route http://localhost:4000/api/summary
 * @query videoId
 * @description get the transcript of the video and then send the transcript to openAI to get the summary of the video
 * @returns Summary of the video
 ***************************************************************/

export const getVideoSummary = asyncHandler(async (req, res) => {
    const { videoId } = req.query;

    if(!videoId) {
        throw new CustomError("videoId is required", 400)
    }

    // gettings the transcript of the video
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId)
    const transcript = transcriptArr.map(item => item.text).join(" ")
    
    // getting the summary from the transcript
    const prompt = `You are Yotube video summarizer. You will be taking the transcript text
    and summarizing the entire video and providing the important summary in points. Please provide the summary of the text given here: `

    const result = await model.generateContent(prompt + transcript)
    const response = await result.response;
    const text = response.text();
    res.status(200).json({
        success: true,
        summary: text
    });
})