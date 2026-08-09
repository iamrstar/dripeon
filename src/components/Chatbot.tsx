"use client";

import { useEffect, useRef } from 'react';
import '@n8n/chat/style.css';

export default function Chatbot() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    // We only want to import and initialize on the client side
    const initChat = async () => {
      try {
        const { createChat } = await import('@n8n/chat');
        createChat({
          // PLACEHOLDER: Replace this with your actual n8n Webhook URL once your self-hosted instance is running
          webhookUrl: 'https://n8n.yourdomain.com/webhook/chat-endpoint',
          
          // You can customize the look of the chat here to match Dripeon's aesthetic
          initialMessages: [
            'Hey there! 💁‍♀️',
            'I am Cipher, your personal AI stylist and support assistant. How can I help you drip today?'
          ],
          i18n: {
            en: {
              title: 'Dripeon Support',
              subtitle: 'Ask about products, sizing, or tracking',
              footer: '',
              getStarted: 'New Conversation',
              inputPlaceholder: 'Type your question...',
            },
          },
        });
        initialized.current = true;
      } catch (err) {
        console.error("Failed to load n8n chat:", err);
      }
    };

    initChat();
  }, []);

  return (
    <style dangerouslySetInnerHTML={{__html: `
      /* Hide the default n8n chat toggle SVG */
      .chat-window-toggle svg {
        display: none !important;
      }
      /* Inject a custom Bot icon instead */
      .chat-window-toggle {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 8V4H8'/%3E%3Crect width='16' height='12' x='4' y='8' rx='2'/%3E%3Cpath d='M2 14h2'/%3E%3Cpath d='M20 14h2'/%3E%3Cpath d='M15 13v2'/%3E%3Cpath d='M9 13v2'/%3E%3C/svg%3E") !important;
        background-size: 26px !important;
        background-repeat: no-repeat !important;
        background-position: center !important;
      }
      
      /* Dripeon Premium Theme Overrides */
      :root {
        --chat--color-primary: #111111 !important;
        --chat--color-primary-shade-50: #000000 !important;
        --chat--color-primary-shade-100: #000000 !important;
        --chat--color-secondary: #f4f4f4 !important;
        --chat--color-secondary-shade-50: #e0e0e0 !important;
        --chat--color-white: #ffffff !important;
        --chat--color-light: #ffffff !important;
        --chat--color-light-shade-50: #f4f4f4 !important;
        --chat--color-light-shade-100: #e0e0e0 !important;
        --chat--color-dark: #111111 !important;
        
        --chat--window--border-radius: 12px !important;
        --chat--toggle--background: #111111 !important;
        --chat--toggle--hover--background: #000000 !important;
        --chat--toggle--active--background: #222222 !important;
        
        --chat--message--bot--background: #f4f4f4 !important;
        --chat--message--bot--color: #111111 !important;
        --chat--message--user--background: #111111 !important;
        --chat--message--user--color: #ffffff !important;
      }
    `}} />
  );
}
