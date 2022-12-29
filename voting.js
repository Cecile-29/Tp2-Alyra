const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests of Voting smart contract", function () {
        let accounts;
        let voting;
        let deployer;
        let voter1;
        let voter2;
        let voter3;
        let voter4;

        before(async function () {
            accounts = await ethers.getSigners()
            voter1 = accounts[0]
            voter2 = accounts[1]
            voter3 = accounts[2]
            voter4 = accounts[3]
        })
       
        describe("tests function getVoter", async function() {
            beforeEach(async function () {
                await deployments.fixture(["voting"])
                voting = await ethers.getContract("Voting")
                accounts = await ethers.getSigners()
            })

            it("should be possible if caller is a voter", async function () {
                await voting.addVoter(voter1.address)
                let voterRegistered = voting.connect(voter1.address).getVoter(voter1.address)
                assert(voterRegistered, "revert when the caller is not a voter")
            })

            it("should get a voter", async function () {
                await voting.addVoter(voter1.address)
                let voterToGet = await voting.getVoter(voter1.address)
                assert(voterToGet.isRegistered === true)
            })

            it("should return a non registered voter", async function () {
                await voting.addVoter(voter1.address)
                let voterUnlisted = await voting.getVoter(voter2.address)
                assert(voterUnlisted.isRegistered === false)
            })            
        })

        describe("tests function getOneProposal", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    await voting.addVoter(voter1.address)
                    await voting.addVoter(voter2.address)
                    await voting.startProposalsRegistering()
                })

                it("should be possible if caller is a voter", async function () {
                    let voterRegistered = voting.connect(voter1.address).addProposal(0)////
                    assert(voterRegistered, "revert when the caller is not a voter")
                })

                it("should return the string expected at the id 0 in state ProposalsRegistrationStarted", async function () {
                    let awaitDescription = "GENESIS"
                    let proposalId0 = await voting.getOneProposal(0)
                    assert(proposalId0.description === awaitDescription)
                })

                it("should get aproposal", async function () { 
                    await expect(voting.addProposal("Hello world !")).to.emit(
                        voting,
                        "ProposalRegistered"
                    )
                    let proposalToGet = await voting.getOneProposal(1)
                    assert(proposalToGet.description === "Hello world !")
                })
            })

            describe("tests function addVoter", async function() {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.addVoter(voter1.address)
                })
    
                describe("should be in correct status", function testWorkflowStatus() {
                    it("workflowStatus should be 0 at enum WorkflowStatus", async function () {
                        let statusRegisteringVoters = await voting.workflowStatus()
                        assert(statusRegisteringVoters === 0, "not RegisteringVoters status")
                    })
                })
                it("should be possible if caller is the owner", async function () {
                    let voterRegistered = voting.connect(deployer).addVoter(voter1.address)
                    assert(voterRegistered, "revert when the caller is not the owner")
                })
    
                it("should emit when a voter is added", async function () {
                    await expect(voting.addVoter(voter3.address)).to.emit(
                        voting,
                        "VoterRegistered"
                    )
                })
                 
                it("should check if a voter is already added", async function () {
                        expect(voting.connect(deployer).addVoter(voter1.address),
                        'Already registered')
                })          
            })

            describe("tests function ProposalsRegistrationStarted", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                })
    
                it("workflowStatus should be ProposalsRegistrationStarted status", async function () {
                   let statusProposalsRegistrationStarted = await voting.startProposalsRegistering()
                   assert(statusProposalsRegistrationStarted, "not ProposalsRegistrationStarted status")
                })
            })

            describe("tests function addProposal", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.addVoter(voter2.address)
                    await voting.addVoter(voter3.address)
                    await voting.startProposalsRegistering()
                })

                it("should emit event ProposalRegistered", async function () {
                    await expect(voting.connect(voter2).addProposal("Hello")).to.emit(
                        voting,
                        "ProposalRegistered"
                    )
                })
                
                it("should be possible if caller is a voter", async function () {
                    let proposalOfVoter = voting.connect(voter2.address).addProposal("world")
                    assert(proposalOfVoter, "revert when the caller is not a voter")
                })

                it("should not possible if the proposal is empty", async function () {
                    let blankProposal = voting.addProposal("")
                    assert(blankProposal, "blank proposal")
                })
                
            })

            describe("should be in correct status", function testWorkflowStatus() {
                it("workflowStatus should be ProposalsRegistrationEnded status", async function () {
                    let statusProposalsRegistrationEnded = await voting.workflowStatus()
                    assert(statusProposalsRegistrationEnded, "not ProposalsRegistrationStarted status")
                })
            })

            describe("tests status endProposalsRegistering", async function () {
                before(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.endProposalsRegistering()
                })

                it("workflowStatus should be ProposalsRegistrationEnded status", async function () {
                    let statusProposalsRegistrationEnded = await voting.workflowStatus()
                    assert(statusProposalsRegistrationEnded, "not ProposalsRegistrationStarted status")
                    })
                
                it("should emit event ProposalsRegistrationEnded", async function () {
                    await voting.endProposalsRegistering()
                    await expect(voting.endProposalsRegistering()).to.emit(
                        voting,
                        "ProposalsRegistrationEnded"
                    )
                })
            })

            describe("tests status startVotingSession ", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.startVotingSession()
                })
            
                it("workflowStatus should be startVotingSession status", async function () {
                    let statusStartVotingSession = await voting.startVotingSession()
                    assert(statusStartVotingSession, "not startVotingSession status")
                })

                it("should emit event startVotingSession", async function () {
                    await expect(voting.startVotingSession()).to.emit(
                        voting,
                        "startVotingSession"
                    )
                })
            })

            describe("tests setVoter function ", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.startVotingSession()
                    //in progress
                })
            })

            describe("tests tallyVotes function ", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.startVotingSession()
                    //in progress
                })
            })

            describe("tests status endVotingSession", async function () {
                beforeEach(async function () {
                    await deployments.fixture(["voting"])
                    voting = await ethers.getContract("Voting")
                    accounts = await ethers.getSigners()
                    await voting.endVotingSession()
                })
            
                it("workflowStatus should be endVotingSession status", async function () {
                    let statusEndVotingSession = await voting.endVotingSession()
                    assert(statusEndVotingSession, "not endVotingSession status")
                })

                it("should emit event endVotingSession", async function () {
                    await expect(voting.endVotingSession()).to.emit(
                        voting,
                        "endVotingSession"
                    )
                })
            })
   
    })
