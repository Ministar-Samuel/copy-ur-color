
# Changelog

All notable changes to the Copy Color Converter project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-12-27

### Added
- Flexible color input system with case-insensitive parsing
- Real-time partial color previews after 3+ characters are entered
- Progressive validation system with helpful error messages
- Support for incomplete color codes with visual feedback
- Enhanced HEX input supporting 3-digit shorthand (e.g., #F00 → #FF0000)
- Partial color preview for RGB, HSL, HSB, and CMYK formats
- Visual indicators for partial vs complete color validation
- Better error messaging for invalid color inputs

### Changed
- Color input validation now works progressively instead of requiring complete format
- HEX colors now accept input with or without # prefix
- All color formats now support case-insensitive input (e.g., RGB or rgb)
- Color preview updates in real-time as user types
- Input fields now show different visual states for invalid, partial, and complete colors

### Fixed
- Color inputs are no longer overly strict about format requirements
- Users can now see color previews while typing incomplete color codes
- Better handling of edge cases in color format parsing

## [1.1.0] - 2024-12-27

### Added
- CHANGELOG.md file to track all project changes
- Pure white/black theme system with high contrast color hierarchy
- Increased container padding by 10% for better spacing
- Updated branding to "Copy Color Converter" with dynamic gradient logo

### Changed
- Background colors changed from gradients to pure white (#FFFFFF) and pure black (#000000)
- All UI elements updated with high-contrast color scheme for better accessibility
- Widget title changed from "Color Converter" to "Copy Color Converter"
- Logo gradient now dynamically contrasts with background (dark gradient on light mode, light gradient on dark mode)

### Fixed
- HSB and CMYK color previews now display actual colors instead of gray placeholder
- Color preview squares now properly convert HSB/CMYK values to displayable RGB colors

## [1.0.0] - 2024-12-27

### Added
- Initial release of Copy Color Converter widget
- Support for 5 color formats: HEX, RGB, HSL, HSB, CMYK
- Unified format system where all inputs accept only the selected format
- Real-time color conversion when switching between formats
- Copy functionality for formatted color values
- Color preview squares for visual feedback
- Add/remove color functionality (up to 20 colors)
- Responsive grid layout that fits viewport without scrolling
- Dark/light mode toggle with smooth transitions
- Input validation with visual error states for invalid colors
- Toast notifications for user feedback
- Gradient backgrounds and glassmorphism design elements
