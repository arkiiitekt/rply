import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Prompt #1
const basePromptPrefix =
`
Write an email with the text below. Use a casual and friendly tone.
`


const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // Prompt #2.
  const secondPrompt = 
  `
  Take the email below and make it sound more professional, positive, and friendly:
 ${basePromptOutput.text}
  `
  
  // Call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // Increase temperature.
    temperature: 0.85,
    max_tokens: 250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;