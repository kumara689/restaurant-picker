import { useState, useEffect } from "react";
import axios from "axios";
import io, { Socket } from "socket.io-client";

const Chat = () => {
  const [restaurants, setRestaurants] = useState([
    { id: "", name: "", location: "", sessionId: "" },
  ]);
  const [newRestaurant, setNewRestaurant] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // useEffect(() => {
  //   // Fetch restaurants from the backend when the component mounts
  //   axios
  //     .get("wss://localhost:9292/ws/restaurants")
  //     .then((response) => setRestaurants(response.data))
  //     .catch((error) => console.error("Error fetching restaurants:", error));
  // }, []);

  // Connect to the WebSocket server
  const socket = io("http://localhost:9292/ws/");

  useEffect(() => {
    // Listen for updates from the server
    socket.on("restaurants", (data) => {
      setRestaurants(data);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleRestaurantSubmit = () => {
    // Send a new restaurant to the backend
    axios
      .post("http://localhost:9292/api/restaurants", { name: newRestaurant })
      .then((response) => {
        setRestaurants([...restaurants, response.data]);
        setNewRestaurant("");
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  return (
    <div>
      <ul className="list-group">
        {restaurants.map((restaurant, index) => (
          <li
            key={restaurant.id}
            className={
              selectedIndex === index
                ? "list-group-item active"
                : "list-group-item"
            }
            onClick={() => {
              setSelectedIndex(index);
            }}
          >
            {restaurant.name}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={newRestaurant}
          onChange={(e) => setNewRestaurant(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-success"
          onClick={handleRestaurantSubmit}
        >
          Add Restaurant
        </button>
      </div>
    </div>
  );
};

export default Chat;
