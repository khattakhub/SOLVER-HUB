import React from 'react';

/**
 * This component is permanently disabled to prevent a global error banner from showing.
 * API key errors are now handled locally within each tool's interface.
 * @deprecated
 */
const ApiKeyErrorBanner: React.FC = () => {
    return null;
};

export default ApiKeyErrorBanner;
