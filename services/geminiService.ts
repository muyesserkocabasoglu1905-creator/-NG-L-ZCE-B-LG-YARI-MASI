import { GoogleGenAI, Type } from '@google/genai';
import { QuestionType, QuizQuestion } from '../types';

const getAiClient = () => {
    // The API key is now expected to be available as an environment variable.
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
}

const getResponseSchemaForType = (questionType: QuestionType) => {
    const baseProperties = {
        type: { type: Type.STRING },
        question: { type: Type.STRING },
    };

    switch(questionType) {
        case 'multiple-choice':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                },
                required: ['type', 'question', 'options', 'correctAnswer'],
            };
        case 'fill-in-the-blank':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    question: { type: Type.STRING, description: 'The question sentence with "___" for the blank.' },
                    correctAnswer: { type: Type.STRING },
                },
                required: ['type', 'question', 'correctAnswer'],
            };
        case 'matching':
            return {
                type: Type.OBJECT,
                properties: {
                    ...baseProperties,
                    question: { type: Type.STRING, description: 'The instruction for the matching question, e.g., "Match the words to their definitions."' },
                    pairs: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                term: { type: Type.STRING },
                                definition: { type: Type.STRING },
                            },
                            required: ['term', 'definition'],
                        },
                    },
                },
                required: ['type', 'question', 'pairs'],
            };
    }
}

export const generateQuizQuestions = async (
  grade: string,
  topic: string,
  difficulty: string,
  questionType: QuestionType,
  count: number = 5
): Promise<QuizQuestion[]> => {
  const ai = getAiClient();
  const model = 'gemini-2.5-flash'; 

  const schema = getResponseSchemaForType(questionType);
  if (!schema) {
    throw new Error(`Unsupported question type: ${questionType}`);
  }

  const systemInstruction = `You are an expert English language teacher and curriculum designer. Your task is to create high-quality, engaging, and age-appropriate quiz questions for students. Strive for creativity and avoid repetitive or stereotypical questions. Each quiz should feel fresh and unique.`;

  const prompt = `
    Generate ${count} high-quality quiz questions for a grade ${grade} English language student.
    The topic is "${topic}".
    The difficulty level must be "${difficulty}".
    The question type must be "${questionType}".

    **General Quality Guidelines:**
    - All questions must be clear, unambiguous, and grammatically perfect.
    - Questions should be educationally valuable and test meaningful knowledge for the specified grade level.
    - Avoid trivial or overly simple questions. The difficulty should be challenging but fair.
    - Ensure the content is engaging and relevant to a student of this age.

    **Variety Requirement:**
    - Ensure the questions are varied in their approach to the topic. For example, if the topic is 'Friendship', don't just ask for definitions. Ask about scenarios, idioms, or feelings related to friendship.
    - Each question in this batch should test a different aspect of the topic if possible.

    **Instructions for question type "${questionType}":**
    - 'multiple-choice': Provide exactly 4 options. The correct answer must be clearly correct. The other three options (distractors) must be plausible and common mistakes a student might make, but definitively incorrect. Avoid silly or obviously wrong distractors.
    - 'fill-in-the-blank': The 'question' sentence must be natural and contain '___' where the answer should go. The blank should test a specific vocabulary word or grammar concept.
    - 'matching': Provide exactly ${count > 1 ? count : 4} pairs of terms and definitions. The terms and definitions should be closely related to the topic to create a meaningful matching challenge.

    Return the result as a JSON array of objects, strictly following the provided schema for the '${questionType}' type.
    Do not include any markdown formatting like \`\`\`json. The output must be only the raw JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: schema,
        },
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const questions = JSON.parse(jsonText) as QuizQuestion[];

    if (!Array.isArray(questions) || questions.length === 0) {
        console.error("Parsed questions are not a valid array or empty:", questions);
        throw new Error("Generated content is not a valid quiz question array.");
    }
    
    // Additional validation to ensure the type matches what we asked for.
    const filteredQuestions = questions.filter(q => q.type === questionType);
    if (filteredQuestions.length !== questions.length) {
        console.warn("Model returned a question with a mismatched type. Filtering it out.");
    }

    return filteredQuestions;
  } catch (error) {
    console.error("Error generating quiz questions from Gemini API:", error);
    throw new Error("Failed to generate quiz questions. The API returned an error or invalid data.");
  }
};
