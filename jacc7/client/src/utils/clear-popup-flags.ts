// Clear popup flags utility - simplified and optimized
const POPUP_FLAGS = [
  'hasSeenOnboarding',
  'hasSeenWalkthrough',
  'hasSeenTutorial',
  'tutorialCompleted',
  'onboardingCompleted',
  'walkthroughCompleted'
];

export function clearPopupFlags() {
  let clearedCount = 0;
  
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    POPUP_FLAGS.forEach(flag => {
      if (localStorage.getItem(flag)) {
        localStorage.removeItem(flag);
        clearedCount++;
      }
    });
    
    if (clearedCount > 0) {
      console.log(`Cleared ${clearedCount} popup flags from localStorage`);
    }
  });
}