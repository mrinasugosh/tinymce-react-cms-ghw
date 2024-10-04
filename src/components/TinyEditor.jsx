import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';



export default function TinyEditor() {

    const revisions = [
        {
          revisionId: "3",
          createdAt: "2024-10-04T10:11:21.578Z",
          content: `
           <h1>The Adventure Begins: Discovering Iceland's Hidden Wonders</h1>
           <p>It was a crisp, clear morning as we stepped out into the cool Icelandic air. The sky was painted in hues of blue and gold, promising a day of exploration. But this wasn't just any ordinary day—it was the beginning of an unforgettable journey through one of the most enchanting countries in the world. Armed with our curiosity and sense of adventure, we set off to uncover Iceland’s top sights, hidden deep within its breathtaking landscapes.</p>
           <p>Our first stop: the famous <strong>Golden Circle</strong>, a must-see route that includes <em>Þingvellir National Park</em>, <strong>Geysir Geothermal Area</strong>, and the magnificent <strong>Gullfoss Waterfall</strong>.</p>
         `,
        },
        {
          revisionId: "2",
          createdAt: "2024-10-04T08:30:21.578Z",
          content: `
           <h1>Reykjavík: A City of Charm and Mystery</h1>
           <p>After exploring the wilds of the Golden Circle, we ventured into the heart of Iceland: Reykjavík. This vibrant city offered a perfect blend of history, culture, and modern charm. We marveled at the towering architecture of <strong>Hallgrímskirkja Church</strong>, explored the shimmering <strong>Harpa Concert Hall</strong>, and strolled down <em>Laugavegur Street</em>, savoring Icelandic cuisine and picking up unique souvenirs.</p>
           <p>The city was a treasure trove of experiences, much like the glowing stone Luna discovered on her journey.</p>
         `,
        },
        {
          revisionId: "1",
          createdAt: "2024-10-04T22:26:21.578Z",
          content: `
           <h1>Jökulsárlón Glacier Lagoon: A Hidden Gem</h1>
           <p>Our adventure continued to the southeast coast, where we discovered the breathtaking <strong>Jökulsárlón Glacier Lagoon</strong>. Massive icebergs drifted lazily across the crystal-clear waters, creating a surreal and otherworldly scene. We stood in awe, watching nature at its finest.</p>
           <p>Nearby, the <strong>Diamond Beach</strong> sparkled with ice formations, and we couldn’t help but feel like we had stumbled upon a secret wonder, much like Luna uncovering a hidden treasure in the <em>Enchanted Forest</em>.</p>
         `,
        },
      ];

    const getRandomDelay = () => {
    const minDelay = 500;
    const maxDelay = 2000;
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    };
      
    const revisionhistory_fetch = () =>
    new Promise((resolve) => {
        setTimeout(() => {
        resolve(
            revisions
            .sort((a, b) =>
                new Date(a.createdAt) < new Date(b.createdAt) ? -1 : 1
            )
            .reverse()
        );
        }, getRandomDelay());
    });

    const fetchApi = import("https://unpkg.com/@microsoft/fetch-event-source@2.0.1/lib/esm/index.js").then(module => module.fetchEventSource);

// This example stores the API key in the client side integration. This is not recommended for any purpose.
// Instead, an alternate method for retrieving the API key should be used.
const api_key = import.meta.env.VITE_OPENAI_API_KEY;

const ai_request = (request, respondWith) => {
  respondWith.stream((signal, streamMessage) => {
    // Adds each previous query and response as individual messages
    const conversation = request.thread.flatMap((event) => {
      if (event.response) {
        return [
          { role: 'user', content: event.request.query },
          { role: 'assistant', content: event.response.data }
        ];
      } else {
        return [];
      }
    });

    // System messages provided by the plugin to format the output as HTML content.
    const pluginSystemMessages = request.system.map((content) => ({
      role: 'system',
      content
    }));

    const systemMessages = [
      ...pluginSystemMessages,
      // Additional system messages to control the output of the AI
      { role: 'system', content: 'Remove lines with ``` from the response start and response end.' }
    ]

    // Forms the new query sent to the API
    const content = request.context.length === 0 || conversation.length > 0
      ? request.query
      : `Question: ${request.query} Context: """${request.context}"""`;

    const messages = [
      ...conversation,
      ...systemMessages,
      { role: 'user', content }
    ];

    const requestBody = {
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 800,
      messages,
      stream: true
    };

    const openAiOptions = {
      signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify(requestBody)
    };

    const onopen = async (response) => {
      if (response) {
        const contentType = response.headers.get('content-type');
        if (response.ok && contentType?.includes('text/event-stream')) {
          return;
        } else if (contentType?.includes('application/json')) {
          const data = await response.json();
          if (data.error) {
            throw new Error(`${data.error.type}: ${data.error.message}`);
          }
        }
      } else {
        throw new Error('Failed to communicate with the ChatGPT API');
      }
    };

    // This function passes each new message into the plugin via the `streamMessage` callback.
    const onmessage = (ev) => {
      const data = ev.data;
      if (data !== '[DONE]') {
        const parsedData = JSON.parse(data);
        const firstChoice = parsedData?.choices[0];
        const message = firstChoice?.delta?.content;
        if (message) {
          streamMessage(message);
        }
      }
    };

    const onerror = (error) => {
      // Stop operation and do not retry by the fetch-event-source
      throw error;
    };

    // Use microsoft's fetch-event-source library to work around the 2000 character limit
    // of the browser `EventSource` API, which requires query strings
    return fetchApi
    .then(fetchEventSource =>
      fetchEventSource('https://api.openai.com/v1/chat/completions', {
        ...openAiOptions,
        openWhenHidden: true,
        onopen,
        onmessage,
        onerror
      })
    )
    .then(async (response) => {
      if (response && !response.ok) {
        const data = await response.json();
        if (data.error) {
          throw new Error(`${data.error.type}: ${data.error.message}`);
        }
      }
    })
    .catch(onerror);
  });
};

  const editorRef = useRef(null);
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      onInit={(_evt, editor) => editorRef.current = editor}
      init={{
        plugins: 'ai revisionhistory a11ychecker tinymcespellchecker anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
        toolbar: 'aidialog aishortcuts | undo redo revisionhistory | blocks fontfamily fontsize | bold italic underline strikethrough | a11ycheck spellcheckdialog | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        spellchecker_language: 'en',
        revisionhistory_fetch,
        ai_request
      }}
      initialValue="<h1>The Adventure Begins: Discovering Iceland's Hidden Wonders</h1>
<p>It was a crisp, clear morning as we stepped out into the cool Icelandic air. The sky was painted in hues of blue and gold, promising a day of exploration. But this wasn't just any ordinary day—it was the beginning of an unforgettable journey through one of the most enchanting countries in the world. Armed with our curiosity and sense of adventure, we set off to uncover Iceland’s top sights, hidden deep within its breathtaking landscapes.</p>

<h2>1. <strong>Golden Circle: The Gateway to Adventure</strong></h2>
<p>The Golden Circle is where our adventure begins. Much like Luna discovering the secrets of the <em>Enchanted Forest</em>, we found ourselves venturing into a realm of natural wonders:</p>
<ul>
  <li><strong>Þingvellir National Park</strong> – Walk between two continents as the tectonic plates of North America and Eurasia pull apart.</li>
  <li><strong>Geysir Geothermal Area</strong> – Witness the power of the earth as the Strokkur geyser erupts, launching water into the sky every few minutes.</li>
  <li><strong>Gullfoss Waterfall</strong> – A majestic, roaring waterfall that left us in awe, much like finding a hidden treasure in Luna's story.</li>
</ul>"
    />
  );
}