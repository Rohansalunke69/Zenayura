import { NextResponse } from "next/server";

// Local Custom Ayurvedic Knowledge Base
const knowledgeBase = [
    {
        keywords: ["headache", "migraine", "head", "pain"],
        response: "According to Ayurveda, headaches often arise from an imbalance of Vata or Pitta dosha. \n\n• **Remedy:** Apply a few drops of warm Brahmi oil or Ghee on your forehead and massage gently.\n• **Diet:** Avoid spicy, fried foods. Drink warm water with cumin and coriander.\n• **Yoga:** Practice Anulom Vilom (alternate nostril breathing) to balance the energies."
    },
    {
        keywords: ["skin", "dry", "acne", "pimples", "glow"],
        response: "Skin issues are typically related to Pitta (inflammation/acne) or Vata (dryness). \n\n• **Remedy:** For dryness, massage your body with warm Sesame or Almond oil before bathing (Abhyanga). For acne, apply a paste of Neem and Turmeric.\n• **Diet:** Include aloe vera juice and hydrating fruits like melons. Limit excess salt and sugar.\n• **Herb:** Neem and Manjistha are excellent blood purifiers."
    },
    {
        keywords: ["sleep", "insomnia", "tired", "fatigue", "exhausted"],
        response: "Poor sleep and fatigue are strong signs of high Vata dosha.\n\n• **Remedy:** Drink a cup of warm milk with a pinch of nutmeg and Ashwagandha powder before bed.\n• **Diet:** Eat warm, grounding, and easily digestible meals.\n• **Routine:** Disconnect from screens an hour before bed and practice Shavasana or guided Yoga Nidra."
    },
    {
        keywords: ["digestion", "stomach", "acid", "gas", "bloating", "constipation"],
        response: "Digestive issues point to weakened 'Agni' (digestive fire), often an imbalance in Vata (bloating) or Pitta (acidity).\n\n• **Remedy:** Drink CCF Tea (Cumin, Coriander, Fennel seeds boiled in water) throughout the day.\n• **Diet:** Avoid cold drinks during meals. Favor warm, cooked foods over raw salads.\n• **Herb:** Triphala taken with warm water before bed is excellent for regulating digestion."
    },
    {
        keywords: ["immunity", "fever", "cough", "cold", "sick"],
        response: "Coughs and colds are primarily Kapha imbalances. \n\n• **Remedy:** Drink a warm herbal brew (Kadha) made of Tulsi, Ginger, Black Pepper, and honey.\n• **Diet:** Avoid dairy, cold foods, and sweets, as they increase mucus production.\n• **Herb:** Chyawanprash is a classical Ayurvedic formulation to build overall immunity."
    },
    {
        keywords: ["stress", "anxiety", "worry", "panic", "mind"],
        response: "Anxiety and high stress are classical signs of aggravated Vata in the nervous system.\n\n• **Remedy:** Drink calming Ashwagandha or Brahmi tea.\n• **Routine:** Establish a strict daily routine (Dinacharya) with waking up and sleeping at consistent times.\n• **Yoga:** Child’s Pose (Balasana) and deep belly breathing will significantly ground your erratic energy."
    },
    {
        keywords: ["hair", "fall", "dandruff", "bald", "growth"],
        response: "Hair fall is often a sign of excess Pitta dosha (body heat) or poor nutrient absorption (Vata).\n\n• **Remedy:** Massage your scalp with warm Bhringraj or Amla oil twice a week.\n• **Diet:** Increase your intake of Curry leaves, Almonds, and Coconut water.\n• **Herb:** Amla (Indian Gooseberry) is the ultimate Ayurvedic superfood for hair growth."
    }
];

// Fallback message if no keywords match
const genericResponse = "Namaste. I am your Zenayura Local Health Assistant. Could you please specify your symptoms a bit more? For example, you can ask about 'dry skin', 'poor sleep', 'headaches', 'digestion issues', or 'stress', and I will provide you with specific Ayurvedic remedies and Dosha balancing tips.";

function generateLocalAyurvedicResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Check if the user is just saying hi
    if (lowerMessage === "hi" || lowerMessage === "hello" || lowerMessage === "namaste" || lowerMessage === "hey") {
        return "Namaste! I am your Zenayura Local AI Assistant. Please share your health concerns or symptoms, and I will recommend natural Ayurvedic remedies, dietary shifts, and herbs to balance your Doshas.";
    }

    // Find the best matching rule
    for (const item of knowledgeBase) {
        // If any of the keywords in this category are found in the user's message
        const match = item.keywords.some(keyword => lowerMessage.includes(keyword));
        if (match) {
            return item.response;
        }
    }

    // If no keywords matched
    return genericResponse;
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages } = body;

        // Get the very last message from the user
        const latestMessage = messages[messages.length - 1].content;

        // Simulate a slight delay to make the AI feel natural
        await new Promise(resolve => setTimeout(resolve, 800));

        // Generate response locally
        const responseText = generateLocalAyurvedicResponse(latestMessage);

        return NextResponse.json({ text: responseText });

    } catch (error: any) {
        console.error("Local AI Error:", error);
        return NextResponse.json(
            { text: "System Notice: The local AI engine encountered an error parsing your symptoms." },
            { status: 200 }
        );
    }
}
