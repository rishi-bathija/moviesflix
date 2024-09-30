import OpenAI from 'openai';
import { gpt_api } from './constants';

const openai = new OpenAI({
    apiKey: gpt_api, // This is the default and can be omitted
    dangerouslyAllowBrowser: true,
});

export default openai;