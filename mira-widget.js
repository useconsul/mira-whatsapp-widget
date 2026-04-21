// Mira.Ai Custom Widget - Standalone IIFE

(() => {
  if (document.getElementById("mira-custom-widget")) {
    return;
  }
  // Internal constants
  const MIRA_PHONE = "12272132926";
  const MIRA_PROFILE =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mira.Ai%20by%20Workabroad.JPEG-09DTsUV87ZcHUFF4Vg0fQobzN4OJoQ.jpeg";

  // Default configuration
  const defaultConfig = {
    whatsappMessage: "Hello Mira",
    titleText: "Applying from outside Germany?",
    subText: "Apply with Mira.Ai",
    position: "bottom-right",
  };

  // Validation function
  function validateConfig(config) {
    const errors = [];

    // Validate required fields
    if (!config.titleText) errors.push("Title text is required");
    if (!config.subText) errors.push("Sub text is required");

    return errors;
  }

  // Merge with window configuration if it exists
  const config = {
    ...defaultConfig,
    ...(window.MiraWidgetConfig || {}),
  }; // Validate configuration
  const validationErrors = validateConfig(config);
  if (validationErrors.length > 0) {
    Object.assign(config, defaultConfig);
  }

  let isOpen = false;

  function createWidget() {
    // Determine mode based on containerId
    const isEmbeddedMode = !!config.containerId;
    let targetContainer = document.body;

    // For embedded mode, find the target container
    if (isEmbeddedMode) {
      const container = document.getElementById(config.containerId);
      if (!container) {
        console.error(
          `Mira Widget: Container with id "${config.containerId}" not found`
        );
        return;
      }
      targetContainer = container;
    }

    // Create styles (same as before)
    const styles = `
            .mira-custom-widget {
              position: relative;
              width: 100%;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .mira-custom-widget.embedded-mode {
              position: relative !important;
              width: 250px !important;
              height: 100% !important;
              top: auto !important;
              bottom: auto !important;
              left: auto !important;
              right: auto !important;
            }

            .mira-custom-widget.embedded-mode .widget-trigger {
              max-width: none;
              margin-left: 0;
            }

            /* Floating mode styles */
            .mira-custom-widget.floating-mode {
              position: fixed !important;
              z-index: 9999;
              width: auto !important;
            }
            
            /* QR Dropdown Animation */
           .mira-custom-widget .qr-dropdown {
              background: #ffffff;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(16, 37, 66, 0.15);
              overflow: hidden;
              max-height: 0;
              opacity: 0;
              visibility: hidden;
              transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
              transform: translateY(10px) scale(0.95);
              transform-origin: bottom center;
              border: 1px solid #e5e5e5;
              position: absolute;
              width: 250px;
              right: 0;
              bottom: 100%;
              margin-bottom: 10px;
            }
            
            .mira-custom-widget.open .qr-dropdown {
                max-height: 350px;
                opacity: 1;
                visibility: visible;
                margin-bottom: 10px;
                transform: translateY(0) scale(1);
            }

            /* Main Trigger Button */
            .mira-custom-widget .widget-trigger {
              width: 100%;
              width: 250px;
              margin-left: auto;
              background: linear-gradient(135deg, #102542, #064783);
              background-size: 200% 200%;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(16, 37, 66, 0.15);
              cursor: pointer;
              transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
              overflow: hidden;
              color: white;
              border: 2px solid rgba(255, 255, 255, 0.1);
            }
            
            .mira-custom-widget .widget-trigger:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 30px rgba(16, 37, 66, 0.2);
              background: linear-gradient(135deg, #102542, #4834D4);
              background-position: right center;
            }

            /* Content Layout */
            .mira-custom-widget .trigger-content {
                display: flex;
                align-items: center;
                padding: 16px;
                height: 80px;
                box-sizing: border-box;
                position: relative;
            }
            
            .mira-custom-widget .profile-image {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
                margin-right: 12px;
                flex-shrink: 0;
                border: 2px solid #4834D4;
                box-shadow: 0 2px 8px rgba(72, 52, 212, 0.2);
            }

            /* Text Content */
            .mira-custom-widget .text-content {
                flex: 1;
            }
            
            .mira-custom-widget .title-text {
                font-size: 14px;
                font-weight: 600;
                line-height: 1.2;
                margin-bottom: 4px;
                color: white;
            }
            
            .mira-custom-widget .sub-text {
                font-size: 12px;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.2;
            }

            /* Arrow Icon */
            .mira-custom-widget .arrow-icon {
                margin-left: 8px;
                transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                flex-shrink: 0;
            }
            
            .mira-custom-widget.open .arrow-icon {
                transform: rotate(180deg);
            }
            
            .mira-custom-widget .arrow-icon svg {
                width: 20px;
                height: 20px;
                fill: white;
            }

            /* QR Content */
            .mira-custom-widget .qr-content {
                padding: 20px;
                text-align: center;
                background: #f2f9fd;
            }
            
            .mira-custom-widget .qr-code {
                width: 100%;
                max-width: 200px;
                height: auto;
                border-radius: 12px;
                margin: 0 auto 16px;
                display: block;
                box-shadow: 0 2px 12px rgba(16, 37, 66, 0.1);
                border: 4px solid white;
            }
            
            .mira-custom-widget .qr-button {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                background-color: #25D366;
                color: white;
                text-decoration: none;
                font-size: 14px;
                white-space: nowrap;
                font-weight: 600;
                padding: 12px 20px;
                border-radius: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
                border: none;
                cursor: pointer;
                width: 100%;
                box-sizing: border-box;
                margin-top: 8px;
            }

            .mira-custom-widget .qr-button:hover {
                background-color: #128C7E;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(37, 211, 102, 0.3);
            }

            .mira-custom-widget .qr-button:active {
                transform: translateY(0);
            }

            .mira-custom-widget .qr-button::before {
                content: '';
                display: inline-block;
                width: 24px;
                height: 24px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 58 58'%3E%3Cpath fill='white' d='M0 58l4.988-14.963A28.43 28.43 0 011 28.5C1 12.76 13.76 0 29.5 0S58 12.76 58 28.5 45.24 57 29.5 57a28.44 28.44 0 01-13.26-3.273L0 58z'/%3E%3Cpath fill='%2325D366' d='M47.683 37.985c-1.316-2.487-6.169-5.331-6.169-5.331-1.098-.626-2.423-.696-3.049.42l-1.978 2.163c-1.832 1.241-3.529 1.193-5.242-.52l-7.962-7.962c-1.713-1.713-1.761-3.41-.52-5.242.272-.401 2.163-1.978 2.163-1.978 1.116-.627 1.046-1.951.42-3.049 0 0-2.844-4.853-5.331-6.169-1.058-.56-2.357-.364-3.203.482l-1.758 1.758c-5.577 5.577-2.831 11.873 2.746 17.45l5.097 5.097 5.097 5.097c5.577 5.577 11.873 8.323 17.45 2.746l1.758-1.758c.846-.846 1.042-2.145.482-3.203z'/%3E%3C/svg%3E");
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                flex-shrink: 0;
            }

            /* Footer */
            .mira-custom-widget .footer-credit {
                text-align: center;
                padding: 12px 20px;
                background: #f9fafa;
                border-top: 1px solid #efefef;
                font-size: 12px;
                color: #7d7e7f;
            }
            
            .mira-custom-widget .footer-credit a {
                color: #4834D4;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }
            
            .mira-custom-widget .footer-credit a:hover {
                color: #102542;
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .mira-custom-widget {
                    bottom: 10px;
                    right: 10px;
                }
                .mira-custom-widget .widget-trigger,
                .mira-custom-widget .qr-dropdown {
                    width: 280px;
                }
                .mira-custom-widget .trigger-content {
                    padding: 12px;
                    height: 70px;
                }
                .mira-custom-widget .profile-image {
                    width: 40px;
                    height: 40px;
                }
                .mira-custom-widget .title-text {
                    font-size: 14px;
                }
                .mira-custom-widget .sub-text {
                    font-size: 11px;
                }
            }
        `;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);    
    // Create WhatsApp URL with message
    let finalMessage = config.whatsappMessage || "";
    
    // Add referral code to message if provided
    if (config.companyReferralCode) {
      finalMessage += `\nRef: ${config.companyReferralCode}`;
    }
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${MIRA_PHONE}${
      finalMessage
        ? `&text=${encodeURIComponent(finalMessage)}`
        : ""
    }`;
    // Create widget HTML
    const widgetHTML = `
                <div class="mira-custom-widget ${isEmbeddedMode ? 'embedded-mode' : 'floating-mode'}" id="mira-custom-widget">
                <div class="qr-dropdown">
                <div class="qr-content">
                <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  whatsappUrl
                )}&color=102542&bgcolor=ffffff" alt="WhatsApp QR Code">
                <a href="${whatsappUrl}" target="_blank" rel="noreferrer" class="qr-button">Continue on WhatsApp</a>
                </div>
                <div class="footer-credit">
                    Powered by <a href="https://tryworkabroad.com" target="_blank" rel="noreferrer">Workabroad</a>
                </div>
                </div>
                <div class="widget-trigger" id="widget-trigger">
                <div class="trigger-content">                <img class="profile-image" src="${MIRA_PROFILE}" alt="Mira.Ai">
                <div class="text-content">
                <div class="title-text">${config.titleText}</ iv>
                <div class="sub-text">${config.subText}</div>
                </div>
                <div class="arrow-icon">
                <svg viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5z"/>
                </svg>
                </div>
                </div>
                </div>
                </div>
        `;

    // Add widget to page
    targetContainer.insertAdjacentHTML("beforeend", widgetHTML);

    // Get elements
    const widget = document.getElementById("mira-custom-widget");
    const trigger = document.getElementById("widget-trigger");

    // Only apply positioning for floating mode
  if (!isEmbeddedMode) {
    const positionStyles = {
      "bottom-right": { bottom: "20px", right: "20px" },
      "bottom-left": { bottom: "20px", left: "20px" },
      "top-right": { top: "20px", right: "20px" },
      "top-left": { top: "20px", left: "20px" },
    };

    const selectedPosition = positionStyles[config.position] || positionStyles["bottom-right"];
    Object.assign(widget.style, selectedPosition);

    // Adjust dropdown for top positions
    if (config.position.startsWith("top")) {
      const dropdown = widget.querySelector(".qr-dropdown");
      dropdown.style.transformOrigin = "top center";
      dropdown.style.marginTop = "10px";
      dropdown.style.marginBottom = "0";
      dropdown.style.transform = "translateY(-10px) scale(0.95)";
      widget.classList.add("top-position");
    } else {
      widget.classList.add("bottom-position");
    }

    // Entrance animation for floating mode only
    setTimeout(() => {
      widget.style.opacity = "0";
      widget.style.transform = "translateY(100px)";
      widget.style.transition = "opacity 0.5s ease, transform 0.5s ease";

      requestAnimationFrame(() => {
        widget.style.opacity = "1";
        widget.style.transform = "translateY(0)";
      });
    }, 100);
  }

    // Toggle functionality
    function toggleWidget() {
      isOpen = !isOpen;
      widget.classList.toggle("open", isOpen);
    }

    // Event listeners
    trigger.addEventListener("click", toggleWidget);

    // Close when clicking outside
    document.addEventListener("click", (event) => {
      if (!widget.contains(event.target) && isOpen) {
        toggleWidget();
      }
    });

    // Expose control functions
    window.MiraCustomWidget = {
      open: () => {
        if (!isOpen) toggleWidget();
      },

      close: () => {
        if (isOpen) toggleWidget();
      },

      toggle: toggleWidget,
      remove: () => {
        if (widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      },
    };
  }

  // Initialize when DOM is ready

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createWidget);
  } else {
    createWidget();
  }
})();
