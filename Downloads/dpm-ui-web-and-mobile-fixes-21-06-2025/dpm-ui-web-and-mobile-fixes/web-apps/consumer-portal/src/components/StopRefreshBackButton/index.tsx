import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StopRefreshBackButton({handleRefresh}: {handleRefresh: () => void}) {
  const navigate = useNavigate();
  
  useEffect(() => {

    const handleBeforeUnload = (event: { preventDefault: () => void; returnValue: string; }) => {
      handleRefresh(); // Call the refresh handler
      event.preventDefault();
      event.returnValue = ''; // Required for Chrome to show the prompt
      // Most browsers need this line to show the confirmation dialog.
      return ''; // Some browsers also need this return statement.
    };

    const handlePopState = () => {
      // Redirect to the home page when the back button is pressed
      navigate('/', { replace: true });
    };

    // Add event listeners for preventing page reload and back navigation
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Cleanup the event listeners when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  // For refrence to check if the page was reloaded or navigated within the app
  // useEffect(() => {
  //   const navEntries = performance.getEntriesByType('navigation');
  //   if (navEntries.length > 0 && (navEntries[0] as PerformanceNavigationTiming)?.type === 'reload') {
  //  }
  // }, []);
  return (
    <></>
  );
}
