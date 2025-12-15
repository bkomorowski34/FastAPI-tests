function addCacheBuster() {
    function randomString(length = 8) {
      const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    }
  
    const cacheBuster = 'v=' + randomString();
  
    // Aktualizuj <script src="...main.js">
    const script = document.querySelector('script[src*="/static/main.js"]');
    if (script) {
      const url = new URL(script.src, window.location.origin);
      url.searchParams.set('v', cacheBuster);
      script.src = url.toString();
    }

     // Aktualizuj <script src="...cacheBuster.js">
     const secondScript = document.querySelector('script[src*="/static/cacheBuster.js"]');
     if (script) {
       const url = new URL(script.src, window.location.origin);
       url.searchParams.set('v', cacheBuster);
       secondScript.src = url.toString();
     }
  
    // Aktualizuj <link href="...style.css">
    const link = document.querySelector('link[href*="style.css"]');
    if (link) {
      const url = new URL(link.href, window.location.origin);
      url.searchParams.set('v', cacheBuster);
      link.href = url.toString();
    }
  }