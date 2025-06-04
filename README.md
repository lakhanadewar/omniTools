
# OmniTool: All-in-One Utility App

OmniTool is a versatile, all-in-one utility application built with modern web technologies. It offers a collection of handy tools for everyday tasks, designed with Material Design principles for a clean, intuitive, and responsive user experience.

## Features

OmniTool provides a range of utilities, categorized for easy access:

**Converters & Calculators:**
*   **Unit Converter**: Convert various units of measurement (length, weight, temperature).
*   **Area Converter**: Convert between different area units.
*   **Volume Calculator**: Calculate volumes of various 3D shapes.
*   **Calculator**: Perform basic arithmetic calculations.

**Time Management:**
*   **Timer**: Set countdown timers with alerts.
*   **Stopwatch**: Measure elapsed time with lap functionality.

**Measurement & Utilities:**
*   **Ruler**: On-screen ruler for approximate measurements.
*   **Leveler**: Use device sensors as a spirit level.
*   **Height Measurement**: (Conceptual) Placeholder for height estimation.
*   **Flashlight**: Utilize the device's camera flash as a flashlight.

**Camera & QR Tools:**
*   **QR Code Generator**: Create QR codes from text or URLs.
*   **QR Code Reader**: Scan QR codes using your device's camera.
*   **Magnifier**: Use your camera to magnify objects.
*   **Color Detector**: Detect colors from the camera feed.

**User Experience:**
*   **Categorized Browsing**: Tools are organized into intuitive categories.
*   **Favorites**: Mark frequently used tools with a star for quick access in a dedicated "Favorite Tools" section.
*   **Responsive Design**: Adapts to various screen sizes, from mobile to desktop.
*   **Search**: Quickly find tools using the search bar in the header.
*   **PWA Enabled**: Installable on mobile devices for an app-like experience.
*   **Material Design Inspired**: Clean and modern interface.

## Tech Stack

*   **Frontend**:
    *   Next.js (App Router)
    *   React
    *   TypeScript
*   **UI & Styling**:
    *   ShadCN UI Components
    *   Tailwind CSS
    *   Lucide Icons
*   **Generative AI (Backend/Flows)**:
    *   Genkit (for potential AI-powered features)
*   **Barcode/QR Processing**:
    *   `@zxing/browser` & `@zxing/library` (for QR code reading)
    *   `qrcode` (for QR code generation)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (comes with Node.js)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url/omnitool.git
    cd omnitool
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will typically start the app on `http://localhost:9002`.

### Using OmniTool

*   Navigate through the tool categories or use the search bar to find a specific tool.
*   Click on a tool card to open its dedicated page.
*   Click the star icon on a tool card to add or remove it from your favorites.
*   On mobile devices, look for an "Add to Home Screen" or "Install app" option in your browser menu to install OmniTool as a Progressive Web App (PWA).

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` file for more information (if one exists, otherwise, you might want to add one).

## Acknowledgements

*   Built with Firebase Studio
*   ShadCN UI for the fantastic component library
*   Lucide Icons for the clean icon set
*   The Next.js and React teams

---

This README provides a good overview for anyone visiting your project on GitHub.
