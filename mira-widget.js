// Mira.Ai Custom Widget - Standalone IIFE

(() => {
  if (document.getElementById("mira-custom-widget")) {
    return;
  }
  // Translation object
  const translations = {
    en: {
      whatsappMessage: "Hello {{agent}}",
      titleText: "Applying from outside Germany?",
      subText: "Apply with {{agent}}",
      buttonText: "Continue on WhatsApp",
      poweredBy: "Powered by",
    },
    fr: {
      whatsappMessage: "Bonjour {{agent}}",
      titleText: "Vous postulez depuis l'étranger ?",
      subText: "Postulez avec {{agent}}",
      buttonText: "Continuer sur WhatsApp",
      poweredBy: "Propulsé par",
    },
    de: {
      whatsappMessage: "Hallo {{agent}}",
      titleText: "Bewerbung aus dem Ausland?",
      subText: "Bewerben Sie sich mit {{agent}}",
      buttonText: "Fortfahren auf WhatsApp",
      poweredBy: "Unterstützt durch",
    },
  };

  // Default configuration
  const defaultConfig = {
    language: "en",
    agentPhone: "12272132926",
    agentImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mira.Ai%20by%20Workabroad.JPEG-09DTsUV87ZcHUFF4Vg0fQobzN4OJoQ.jpeg",
    agentName: "Mira.Ai",
    titleText: "Applying from outside Germany?",
    position: "bottom-right",
  };

  // Validation function
  function validateConfig(config) {
    const errors = [];

    // Validate required fields (DEPRECATED)
    // if (!config.titleText) errors.push("Title text is required");
    // if (!config.subText) errors.push("Sub text is required");

    // Validate language
    if (config.language && !["en", "fr", "de"].includes(config.language)) {
      errors.push("Invalid language. Supported: en, fr, de");
    }

    return errors;
  }

  // Merge with window configuration if it exists
  const userConfig = window.MiraWidgetConfig || {};
  const config = {
    ...defaultConfig,
    ...userConfig,
  };

  // Get localized strings
  const lang = translations[config.language] ? config.language : "en";
  const t = translations[lang];

  // Fill in missing text fields from translations if not provided by user
  const textFields = [
    "whatsappMessage",
    "titleText",
    "subText",
    "headerSubtitle",
    "statusText",
    "stepsHeading",
    "step1",
    "step2",
    "step3",
    "step4",
    "buttonText",
    "poweredBy",
  ];

  textFields.forEach((field) => {
    if (userConfig[field] === undefined) {
      config[field] = t[field];
    }
  });

  // Replace {{agent}} placeholder in all text configurations
  textFields.forEach((field) => {
    if (typeof config[field] === "string") {
      config[field] = config[field].replace(/{{agent}}/g, config.agentName);
    }
  });

  // Validate configuration
  const validationErrors = validateConfig(config);
  if (validationErrors.length > 0) {
    // If validation fails, we still have our defaults and translations
    console.warn(
      "Mira Widget: Configuration validation errors:",
      validationErrors,
    );
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
          `Mira Widget: Container with id "${config.containerId}" not found`,
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
              --width: 270px;
            }

            .mira-custom-widget.embedded-mode {
              position: relative !important;
              width: var(--width) !important;
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
              width: var(--width);
              right: 0;
              bottom: 100%;
              margin-bottom: 10px;
            }
            
            .mira-custom-widget.open .qr-dropdown {
                max-height: 800px;
                opacity: 1;
                visibility: visible;
                margin-bottom: 10px;
                transform: translateY(0) scale(1);
            }

            /* Main Trigger Button */
            .mira-custom-widget .widget-trigger {
              width: 100%;
              width: var(--width);
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
                flex-wrap: nowrap;
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

            /* QR Content Simplification */
            .mira-custom-widget .qr-content {
                padding: 20px;
                text-align: center;
                background: white;
            }

            /* QR View */
            .mira-custom-widget .qr-section {
                padding: 0;
            }

            .mira-custom-widget .qr-wrapper {
                background: #F9FAFB;
                padding: 16px;
                border-radius: 16px;
                margin-bottom: 20px;
                border: 1px solid #EAECF0;
            }
            
            .mira-custom-widget .qr-code {
                width: 100%;
                max-width: 220px;
                aspect-ratio: 1 / 1;
                margin: 0 auto;
                display: block;
                border-radius: 8px;
                background: white;
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
                font-weight: 600;
                padding: 14px 20px;
                white-space: nowrap;
                border-radius: 12px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
                border: none;
                cursor: pointer;
                width: 100%;
                box-sizing: border-box;
            }

            .mira-custom-widget .qr-button:hover {
                background-color: #128C7E;
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(37, 211, 102, 0.3);
            }

            .mira-custom-widget .qr-button::before {
                content: '';
                display: inline-block;
                width: 20px;
                height: 20px;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z'/%3E%3C/svg%3E");
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
                    width: calc(100vw - 40px);
                    max-width: 340px;
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

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${config.agentPhone}${
      finalMessage ? `&text=${encodeURIComponent(finalMessage)}` : ""
    }`;
    // Create widget HTML
    const widgetHTML = `
                <div class="mira-custom-widget ${isEmbeddedMode ? "embedded-mode" : "floating-mode"}" id="mira-custom-widget">
                  <div class="qr-dropdown">
                    <div class="qr-content">
                      <div class="qr-section">
                        <div class="qr-wrapper">
                          <img class="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                            whatsappUrl,
                          )}&color=102542&bgcolor=ffffff" alt="WhatsApp QR Code">
                        </div>
                        <a href="${whatsappUrl}" target="_blank" rel="noreferrer" class="qr-button">${config.buttonText}</a>
                      </div>
                    </div>
                    <div class="footer-credit">
                          ${config.poweredBy} <a href="https://tryworkabroad.com" target="_blank" rel="noreferrer">Workabroad</a>
                    </div>
                  </div>
                  <div class="widget-trigger" id="widget-trigger">
                    <div class="trigger-content">                
                      <img class="profile-image" src="${config.agentImage}" alt="${config.agentName}">
                      <div class="text-content">
                        <div class="title-text">${config.titleText}</div>
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

      const selectedPosition =
        positionStyles[config.position] || positionStyles["bottom-right"];
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
