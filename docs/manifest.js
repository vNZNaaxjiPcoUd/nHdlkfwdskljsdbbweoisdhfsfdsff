
        window.updateWebManifest = function(customName) {
            window.title = "記";
            const surl  = window.location.origin + "/";
            const currentUrl = window.location.href;

            const myManifest = {
                "id": currentUrl,
                "name": customName || "記",
                "short_name": customName || "記",
                "description": "記是一款瀏覽器的加密筆記本，提供安全的雲端加密儲存。",
                "display": "standalone",
                "theme_color": "#2196F3",
                "background_color": "#F0F0F0",
                "start_url": currentUrl, 
                "scope": surl,
                "icons": [
                    { "src": "https://h.jwint.net/favicon192.png", "sizes": "192x192", "type": "image/png" },
                    { "src": "https://h.jwint.net/favicon512.png", "sizes": "512x512", "type": "image/png" }
                ],
                "orientation": "portrait"
            };

            const stringManifest = JSON.stringify(myManifest);
            const manifestDataURI = 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest);
            
            let link = document.getElementById('dynamic-manifest');
            if (!link) {
                link = document.createElement('link');
                link.id = 'dynamic-manifest';
                link.rel = 'manifest';
                document.head.appendChild(link);
            }
            link.href = manifestDataURI;
        };

        (function() {
            const paramsFromURL = new URLSearchParams(window.location.search);
            const bParam = paramsFromURL.get('book');
            window.updateWebManifest(bParam);
        })();