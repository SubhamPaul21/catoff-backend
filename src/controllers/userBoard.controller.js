const { getUserCurrentStandings } = require('../services/userBoard.service');

exports.getUserCurrentTable = async (req, res) => {
    try {
        const userID = req.UserID; 
        const standings = await getUserCurrentStandings(userID);
        console.log("-----------------", standings)
        
        // // Transform the data if necessary to match the expected response format
        // const results = standings.reduce((acc, curr, index) => ({
        //     ...acc,
        //     [index]: curr
        // }), {});

        res.json(standings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user standings', error: error.message });
    }
};
