const socket = new WebSocket("wss://157.245.77.231:8082/api/socket");

export const listenToTracking = (callback: (data: any) => void) => {
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };
};

export const closeSocket = () => {
  socket.close();
};
