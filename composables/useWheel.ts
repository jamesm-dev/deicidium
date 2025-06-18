interface UseWheelOptions {
  apiKey: string;
  title?: string;
  description?: string;
  entries: Array<{ text: string }>;
}

export async function useWheel(options: UseWheelOptions): Promise<string | null> {
  const wheel = {
    wheelConfig: {
      title: options.title ?? 'Deicidium Guild Raffle',
      description: options.description ?? 'Spin the Wheel of Destiny for your chance to win!',
      entries: options.entries,
    },
    apiKey: options.apiKey,
    shareMode: 'copyable',
  };

  try {
    const response = await fetch('/api/wheel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wheel),
    });

    const jsonResponse = await response.json();

    if (jsonResponse?.data?.path) {
      return `https://wheelofnames.com/${jsonResponse.data.path}`;
    }

    console.error('Invalid response format:', jsonResponse);
    return null;
  } catch (error) {
    console.error('Error creating wheel:', error);
    return null;
  }
}