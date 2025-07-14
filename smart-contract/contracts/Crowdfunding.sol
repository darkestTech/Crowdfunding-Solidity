// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    

    struct Campaign {
        address owner;
        string title;
        string description;
        string category;
        string imageURI;     
        uint goal;
        uint deadline;
        uint raisedAmount;
        bool isClaimed;
    }

    uint public campaignCount = 0;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public contributions;


    event CampaignCreated(
        uint indexed id,
        address indexed owner,
        string title,
        uint goal,
        uint deadline
    );

    event ContributionReceived(
        uint indexed id,
        address indexed contributor,
        uint amount
    );

    event FundsWithdrawn(
        uint indexed id,
        address indexed owner,
        uint amount
    );

    event RefundIssued(
        uint indexed id,
        address indexed contributor,
        uint amount
    );


    ///Create a new crowdfunding campaign
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _category,
        string memory _imageURI,
        uint _goal,
        uint _durationInDays
    ) external {
        require(_goal > 0, "Goal must be greater than zero");
        require(_durationInDays > 0, "Duration must be at least 1 day");

        campaignCount++;
        campaigns[campaignCount] = Campaign({
            owner: msg.sender,
            title: _title,
            description: _description,
            category: _category,
            imageURI: _imageURI,
            goal: _goal,
            deadline: block.timestamp + (_durationInDays * 1 days),
            raisedAmount: 0,
            isClaimed: false
        });

        emit CampaignCreated(
            campaignCount,
            msg.sender,
            _title,
            _goal,
            block.timestamp + (_durationInDays * 1 days)
        );
    }

    ///Contribute ETH to a campaign
    function contribute(uint _id) external payable {
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Send ETH to contribute");

        campaign.raisedAmount += msg.value;
        contributions[_id][msg.sender] += msg.value;

        emit ContributionReceived(_id, msg.sender, msg.value);
    }

    /// Withdraw funds if campaign was successful
    function withdraw(uint _id) external {
        Campaign storage campaign = campaigns[_id];

        require(msg.sender == campaign.owner, "Not the campaign owner");
        require(block.timestamp >= campaign.deadline, "Campaign still running");
        require(campaign.raisedAmount >= campaign.goal, "Goal not reached");
        require(!campaign.isClaimed, "Funds already claimed");

        campaign.isClaimed = true;
        payable(campaign.owner).transfer(campaign.raisedAmount);

        emit FundsWithdrawn(_id, msg.sender, campaign.raisedAmount);
    }

    /// Refund a contributor if campaign failed
    function refund(uint _id) external {
        Campaign storage campaign = campaigns[_id];

        require(block.timestamp >= campaign.deadline, "Campaign not ended");
        require(campaign.raisedAmount < campaign.goal, "Goal was met");

        uint amount = contributions[_id][msg.sender];
        require(amount > 0, "No contribution to refund");

        contributions[_id][msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RefundIssued(_id, msg.sender, amount);
    }

    
    ///  Get all campaign IDs and metadata (for frontend)
    function getCampaign(uint _id) external view returns (Campaign memory) {
        return campaigns[_id];
    }

    /// Get how much a user contributed to a campaign
    function getContribution(uint _id, address _user) external view returns (uint) {
        return contributions[_id][_user];
    }
}
