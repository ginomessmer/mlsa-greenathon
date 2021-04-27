# Microsoft Teams Approval Flow
Every time a new business is submitted, it must be manually approved by the site owners. Approval is done in Microsoft Teams through an automated message sent to a dedicated channel using an Adaptive Card. By interacting with the card, the submission can be accepted or rejected.

The entire process is driven by a Logic App. The Logic App is run as soon as a new submission is available in the Azure queue.

![Process flow](https://user-images.githubusercontent.com/8465892/116291470-e726a500-a794-11eb-98c0-5ed13ae72a71.png)

## Logic App
![Logic App Flow](https://user-images.githubusercontent.com/8465892/116291846-58feee80-a795-11eb-96d5-e553239a7080.png)
