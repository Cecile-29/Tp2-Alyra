# Tp2-Alyra


##      Contract Voting.sol - unit tests project

- Setting up the hardhat runtime environment files is simple as the tests performed on localhost.

- To testing with an abstraction of the node accounts,  ethers.getSigners(),  
 the account [0] is attributed to (voter1 ;) after many error messages when (deployer;) was on it.

- Some Workflow status tests are wrong.

- The initial idea was to create an index for status workflow, 
  from state 0 in the first session of voting to reusing it in tests.

- I had errors with the beforeEach used to determine the specific conditions, 
  to return each time, at the initial state of the contract deployment

- Assert statement is used in pretty all tests, it stops the programm if the assertion is false. 
 It allows to test conditions in the cases where the test should pass or not, as on the possibilities for example :

----- of actions on the functions, with the modifiers and the permissions of the Voting struct,

----- restriction on adding voters and voting more than once,

----- the status of ongoing voting session and state functions,

- Not all functions are tested.




## In tests done :




### the getVoter() getter which is only reserved for voters




1 – With await it is expected that (voter1;) is added to check with the connect() method,
if his address in parameter allows him permission.

2 – It is expected to observe a voter already whitelisted by his address in parameter. 
The test passes if, in the struct Voter, the variable isRegistered has indeed passed to true.

3 – The situation is reversed for a second unregistered voter. The test passes if, in the struct Voter, 
the variable isRegistered is always false.







### the getOneProposal() getter is also used to test the onlyVoter modifier




- In the beforeEach it is expected that the proposals registration session is started, 
and now the current status workflow.

1 - The test passes if a voter is already registered, and verifies the proposal by its ID = 0 added to the 
proposal array at the begginig of the session proposalsRegistrationStarted.

2 - Comparison if the description of proposal(0), matches to the string expected in the test.

3 - To emit the event of a proposal registered, it’s expected with "expect" in the function addProposal() 
a string matching to the assert. Currently using « to.emit » to test if the ProposalRegistered event is send.

To get the proposal by its ID =1, the test pass adding the voting contract instance with the function getOneProposal() , 
and check if the proposal matches to its description in the struct proposal.






### on the getAddVoter() function




1 – Trial function named in a describe, to test the workflow status, 
and to assign an index 0 to the first voting session on going.

2 - On onlyowner only the deployer can add a vote, if this condition is true the test passes.

3 – Test on a VoterRegistered event, if a voter has been added.
 
4 - incomplete test to check if a voter is added.







### on the startProposalsRegistering() function



1 – error in describe text « ProposalsRegistrationStarted » is a status not function.

Is expected at call the function startProposalsRegistering() by the contract instance, that  
ProposalsRegistrationStarted is the current status, otherwise it’s reverted.






### on the addProposal() function




1 - Test on a "ProposalRegistered" event, here to (voter2;)  
the test passes because he is already added in the beforeEach , 
and returns the event if a character string is passed as a parameter.

2 – Test of the onlyVoter modifier with the connect() method.

3 – Test trial if a proposal is empty.

4 - Test trial on ProposalsRegistrationEnded status.


The other tests on the workflow states are useless.

The setVoter() and tallyvotes() functions have not been tested.
