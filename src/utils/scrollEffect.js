/**
 * This utility manages the scroll transition effect for the background
 * It implements a smooth transition between two background images as the user scrolls
 */

// Initialize the scroll effect
export const initScrollEffect = () => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const viewportHeight = window.innerHeight;
    const scrollableArea = documentHeight - viewportHeight;
    
    // Calculate the scroll percentage (0 to 1)
    let scrollPercentage = scrollPosition / scrollableArea;
    
    // Limit to 0-1 range
    scrollPercentage = Math.min(1, Math.max(0, scrollPercentage));
    
    // Apply the scrolled class to app when the user has scrolled halfway
    const appElement = document.querySelector('.app');
    if (appElement) {
      if (scrollPercentage > 0.5) {
        appElement.classList.add('scrolled');
      } else {
        appElement.classList.remove('scrolled');
      }
    }
  };

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Initial check
  handleScroll();
  
  // Return cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};
