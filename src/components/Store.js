import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/Transitions.css';

function Store() {
  const navigate = useNavigate();

  useEffect(() => {
    const shopifyScript = document.createElement('script');
    shopifyScript.async = true;
    shopifyScript.src = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    shopifyScript.onload = function() {
      // @ts-ignore
      var client = window.ShopifyBuy.buildClient({
        domain: 'ug690t-99.myshopify.com',
        storefrontAccessToken: 'a1cdc2f51fb8f0c9f43a8a828a22481c',
      });

      // @ts-ignore
      window.ShopifyBuy.UI.onReady(client).then(function(ui) {
        ui.createComponent('product', {
          id: ['8885392974123'],
          node: document.getElementById('product-component'),
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              iframe: false,
              layout: 'horizontal',
              contents: {
                img: true,
                title: true,
                price: true,
                description: true,
                button: true,
                quantity: true
              },
              styles: {
                product: {
                  "@media (min-width: 601px)": {
                    "max-width": "100%",
                    "margin-left": "0",
                    "margin-bottom": "50px"
                  },
                  "background-color": "transparent",
                  "text-align": "center"
                },
                button: {
                  "font-family": "Special Elite, monospace",
                  "background-color": "black",
                  "color": "white",
                  "border": "1px solid white",
                  ":hover": {
                    "background-color": "#333333"
                  }
                },
                title: {
                  "color": "white",
                  "font-family": "Special Elite, monospace"
                },
                price: {
                  "color": "white",
                  "font-family": "Special Elite, monospace"
                },
                description: {
                  "color": "white",
                  "font-family": "Special Elite, monospace"
                },
                compareAt: {
                  "color": "white",
                  "font-family": "Special Elite, monospace"
                }
              }
            }
          }
        });
      });
    };

    document.head.appendChild(shopifyScript);

    return () => {
      document.head.removeChild(shopifyScript);
    };
  }, []);

  return (
    <div className="page-transition" style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <div className="header-container">
        <div className="header-nav">
          <button 
            className="header-button"
            onClick={() => navigate('/portfolio')}
          >
            Portfolio
          </button>
          <button className="header-button">Store</button>
        </div>
        <img 
          src="/am.png" 
          alt="AM Logo" 
          className="header-logo"
          onClick={() => navigate('/')}
        />
      </div>
      <div id="product-component" style={{ padding: '2rem' }}></div>
    </div>
  );
}

export default Store; 