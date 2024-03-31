import { YoutubeTranscript } from 'youtube-transcript';
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../utils/customError.js';

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});


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

    // // gettings the transcript of the video
    const transcriptArr = await YoutubeTranscript.fetchTranscript(videoId)
    const transcript = transcriptArr.map(item => item.text).join(" ")
    // console.log(transcript)

    
    // getting the summary from the transcript
    const prompt = `You are a video summarizer. Please summarize the transcript provided below and translate into English, Provide the most important points in a bulleted list with no "Here are the key points from the transcript in English:" text.\n\n${transcript}`


    const message = await anthropic.messages.create({
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        model: 'claude-3-opus-20240229',
    });    

    
    res.status(200).json({
        success: true,
        summary: message.content[0].text
    });
})