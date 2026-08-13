import webpush from 'web-push';
import prisma from '@/lib/prisma';

// Ensure you have these variables in your .env or .env.local
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:admin@example.com', // Change this to your actual admin email
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function sendWebPushNotification(title: string, body: string, url: string = '/') {
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.warn('VAPID keys not configured. Skipping push notification.');
    return;
  }

  try {
    const subscriptions = await prisma.adminSubscription.findMany();
    
    if (subscriptions.length === 0) {
      console.log('No admin subscriptions found for push notifications.');
      return;
    }

    const payload = JSON.stringify({
      title,
      body,
      url,
    });

    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          payload
        );
      } catch (error: any) {
        // If the subscription is no longer valid (e.g. user revoked permission)
        if (error.statusCode === 410 || error.statusCode === 404) {
          console.log(`Deleting invalid subscription: ${sub.endpoint}`);
          await prisma.adminSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error('Error sending push notification to endpoint:', error);
        }
      }
    });

    await Promise.all(sendPromises);
  } catch (error) {
    console.error('Failed to send push notifications:', error);
  }
}
