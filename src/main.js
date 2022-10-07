import App from './components/App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'Web Ninja'
  },
});

export default app;