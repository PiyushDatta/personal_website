import { useEffect, useState } from 'react';

const useMarkdown = (loadMarkdownModule) => {
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    markdown: '',
  });

  useEffect(() => {
    if (!loadMarkdownModule) {
      setState({
        error: null,
        isLoading: false,
        markdown: '',
      });

      return undefined;
    }

    let ignore = false;

    const loadMarkdown = async () => {
      setState({
        error: null,
        isLoading: true,
        markdown: '',
      });

      try {
        const markdownModule = await loadMarkdownModule();
        const response = await fetch(markdownModule.default);
        const markdown = await response.text();

        if (!ignore) {
          setState({
            error: null,
            isLoading: false,
            markdown,
          });
        }
      } catch (error) {
        if (!ignore) {
          setState({
            error,
            isLoading: false,
            markdown: '',
          });
        }
      }
    };

    loadMarkdown();

    return () => {
      ignore = true;
    };
  }, [loadMarkdownModule]);

  return state;
};

export default useMarkdown;
