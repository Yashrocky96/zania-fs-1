import React, {useEffect, useState} from 'react';

const staticData = [{
	"type": "bank-draft", "title": "Bank Draft", "position": 0

}, {"type": "bill-of-lading", "title": "Bill of Lading", "position": 1}, {
	"type": "invoice", "title":
		"Invoice", "position": 2
}, {"type": "bank-draft-2", "title": "Bank Draft 2", "position": 3}, {
	"type":
		"bill-of-lading-2", "title":
		"Bill of Lading 2", "position": 4
}]

function App() {
  const [loading, setLoading] = useState({});
  const [imageUrls, setImageUrls] = useState([]);

  // Generate random image URLs once when the component mounts
  useEffect(() => {
    const generateRandomUrls = () => {
      return staticData.map(() => {
        const randomNumber = (min = 1, max = 100) => Math.floor(Math.random() * (max - min) + min);
        return `https://picsum.photos/id/${randomNumber()}/200`;
      });
    };

    // Initialize loading state for each image to true
    setImageUrls(generateRandomUrls());
    setLoading(staticData.reduce((acc, _, index) => ({ ...acc, [index]: true }), {}));
  }, []);

  const handleImageLoad = (index) => {
    setLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageError = (index) => {
    setLoading((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="App">
      <div className="grid grid-cols-3 gap-4 m-2">
        {staticData.map((data, index) => (
          <div className="flex flex-col items-center" key={index}>
            <p>{data.title}</p>
            {loading[index] && (
              <div className="spinner border-t-4 border-blue-500 border-solid rounded-full w-8 h-8 animate-spin mb-2"></div>
            )}
            <img
              src={imageUrls[index]}
              alt={data.type}
              height="200px"
              width="200px"
              onLoad={() => handleImageLoad(index)}
              onError={() => handleImageError(index)}
              style={{ display: loading[index] ? 'none' : 'block' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
