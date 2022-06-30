import {WebhookService} from '../src/index';
import {getRandomInt} from './utils/random';

describe('Webhook Service Test', () => {
  let webhookEndpoint;
  test('Create a webhook endpoint', () => {
    const body = {target: 'https://en0uutwjuf9jdg.x.pipedream.net/', events: [{type: 'connection.follow'}, {type: 'connection.unfollow'}]};
    return WebhookService.createWebhookEndpoint(body).then((data) => {
      expect(data).toBeInstanceOf(Object);
      webhookEndpoint = data;
    });
  });
  test('Update a specific webhook endpoint', () => {
    const body = {target: 'https://en0uutwjuf9jdg.x.pipedream.net/', events: [{type: 'connection.follow'}, {type: 'poll_vote.created'}]};
    return WebhookService.updateASpecificWebhookEndpoint(webhookEndpoint.id, body).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Update a single field of specific webhook endpoint', () => {
    const body = {is_active: true};
    return WebhookService.updateASingleWebhookEndpointField(webhookEndpoint.id, body).then((data) => {
      expect(data).toBeInstanceOf(Object);
    });
  });
  test('Get all webhook endpoints', () => {
    return WebhookService.getAllWebhookEndpoints().then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Get all webhook event', () => {
    return WebhookService.getAllWebhookEvents().then((data) => {
      expect(data).toBeInstanceOf(Array);
    });
  });
  test('Get a specific webhook endpoint', () => {
    return WebhookService.getASpecificWebhookEndpoint(webhookEndpoint.id).then((data) => {
      expect(data).toHaveProperty('events');
    });
  });
  test('Get all webhook endpoints attempts', () => {
    return WebhookService.getAllWebhookEndpointAttempts(webhookEndpoint.id).then((data) => {
      expect(data.results).toBeInstanceOf(Array);
    });
  });
  test('Expire a specific webhook endpoint signing secret', () => {
    return WebhookService.expireWebhookSigningSecret(webhookEndpoint.id).then((data) => {
      expect(data).toHaveProperty('events');
    });
  });
  test('Reveal a specific webhook endpoint signing secret', () => {
    return WebhookService.revealWebhookSigningSecret(webhookEndpoint.id).then((data) => {
      expect(data).toHaveProperty('signing_secret');
    });
  });
  test('Resend a specific webhook endpoint event', () => {
    const event = getRandomInt();
    return WebhookService.resendWebhookEndpointEvent(webhookEndpoint.id, event).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Resend a specific webhook endpoint event in bulk', () => {
    const events = [getRandomInt(), getRandomInt()];
    return WebhookService.resendMultipleWebhookEndpointEvent(webhookEndpoint.id, events).then((data) => {
      expect(data).toBe('');
    });
  });
  test('Delete a specific webhook endpoint', () => {
    return WebhookService.deleteWebhookEndpoint(webhookEndpoint.id).then((data) => {
      expect(data).toBe('');
    });
  });
});
