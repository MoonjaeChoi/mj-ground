import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useWorkNumbers = () => {
    const { data, error, isLoading, mutate } = useSwr('/api/worknumbers', fetcher, {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    });
    return {
      data,
      error,
      isLoading,
      mutate
    }
  };
  
  export default useWorkNumbers;
  