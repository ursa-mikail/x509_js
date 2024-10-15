       // Pre-defined array of random lines

        const lines = [
            "Hello, world!",
            "Randomness is the essence of creativity.",
            "Randomness is not a lack of order; it is a different kind of order.", 
            "The only thing certain about randomness is that it is not predictable.",
            "In randomness lies the potential for creativity.",
            "The universe is under no obligation to make sense to you.",
            "We are all just one random event away from changing our lives forever."
        ];
 /*
        // Initialize an array to store lines from the file
        let lines = [];

        // Function to fetch lines from hello_data.txt
        async function fetchLines() {
            try {
                const response = await fetch('./hello_data.txt');
                const text = await response.text();
                lines = text.split('\n'); // Split the text into lines
                typeText(); // Start typing effect after fetching lines
            } catch (error) {
                console.error('Error fetching the text file:', error);
                document.getElementById("helloText").innerText = "Failed to load random text.";
            }
        }
*/
        // Function to get a random line from the array
        function getRandomLine() {
            const randomIndex = Math.floor(Math.random() * lines.length);
            return lines[randomIndex]; // Return the random line
        }

        // Function to type out the text
        function typeText() {
            const $hello = getRandomLine(); // Get a random line from the array
            let index = 0; // Initialize an index to keep track of the current character
            
            // Type out each character
            function typeNextCharacter() {
                if (index < $hello.length) {
                    document.getElementById("helloText").innerHTML += $hello.charAt(index);
                    index++;
                    setTimeout(typeNextCharacter, 100); // Call the next character after a delay
                }
            }

            typeNextCharacter(); // Start typing the text
        }

        // Start the typing effect
        typeText();

