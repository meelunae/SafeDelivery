// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Shipment {
  enum DeliveryStatus { CREATED, PAID, SHIPPED, DELIVERED }

  struct Package {
    string packageId;
    DeliveryStatus status;
    address sender;
    address receiver;
    uint256 amount;
  }

  //mapping(string => Package) packages;
  Package[] packages;
  address owner;

  event Funded(address indexed sender, uint256 amount);
  event PackageCreated(string packageId, address sender, address receiver, uint256 value);
  event PackagePaidFor(string packageId);
  event PackageShipped(string packageId);
  event PackageDelivered(string packageId, address sender, uint256 amount);
  event DeliveryStatusUpdated(string packageId, DeliveryStatus status);


  // This modifier is required so that only the owners of the contract can access informations about packages that are shipped
  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
  }

  modifier onlyBuyer(string memory _packageId) {
      for (uint i = 0; i < packages.length; i++) {
        if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
          require(msg.sender == packages[i].receiver, "Only the package receiver can call this function");
          _; 
          return;
        }
      }
      revert("Package not found");
  }

  modifier onlySeller(string memory _packageId) {
      for (uint i = 0; i < packages.length; i++) {
        if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
          require(msg.sender == packages[i].sender, "Only the package sender can call this function");
          _; 
          return;
        }
      }
      revert("Package not found");
    }

  constructor() public {
    owner = msg.sender;
  }

  // This function is called to save a newly-created package on chain. 
  function createPackage(string memory _packageId, address _receiver, uint256 _amount) public {
      Package memory newPackage = Package(_packageId, DeliveryStatus.CREATED, msg.sender, _receiver, _amount);
      packages.push(newPackage);
      emit DeliveryStatusUpdated(_packageId, DeliveryStatus.CREATED);
      emit PackageCreated(_packageId, msg.sender, _receiver, _amount);
      return;
  }

  // Marking the package as shipped
  function shipPackage(string memory _packageId) public onlySeller(_packageId) {
    for (uint i = 0; i < packages.length; i++) {
      if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
          require(packages[i].status == DeliveryStatus.PAID, "Package is not in the correct status");
          packages[i].status = DeliveryStatus.SHIPPED;
          emit DeliveryStatusUpdated(_packageId, DeliveryStatus.SHIPPED);
          emit PackageShipped(_packageId);
          return;
      }
    }
    revert("Package not found");
  }

  // Payment from receiver to contract
  function payForPackage(string memory _packageId) public payable onlyBuyer(_packageId) {
    for (uint i = 0; i < packages.length; i++) {
      if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
        require(packages[i].status == DeliveryStatus.CREATED, "Package is not in the correct status");
        require(msg.value == packages[i].amount, "Incorrect payment amount");
        packages[i].status = DeliveryStatus.PAID;
        emit DeliveryStatusUpdated(_packageId, DeliveryStatus.PAID);
        emit PackagePaidFor(_packageId);
        return;
      }
    }
    revert("Package not found");
  }

    // Function responsible for package delivery and payouts
  function deliverPackage(string memory _packageId) public payable onlyBuyer(_packageId) {
    for (uint i = 0; i < packages.length; i++) {
      if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
        require(packages[i].status == DeliveryStatus.SHIPPED, "Package has not been shipped yet, can't be scanned!");
        require(packages[i].status != DeliveryStatus.DELIVERED, "Package has already been delivered");
        
        address payable sender = address(uint160(packages[i].sender));
        sender.transfer(packages[i].amount);

        // Update package status
        packages[i].status = DeliveryStatus.DELIVERED;
        emit DeliveryStatusUpdated(_packageId, DeliveryStatus.DELIVERED);
        emit PackageDelivered(_packageId, packages[i].sender, packages[i].amount);
        return;
      }
    }
    revert("Package not found");
  }

  function getAllPackages() public view onlyOwner returns (Package[] memory) {
    return packages;
  }

  function getPackageById(string memory _packageId) public view onlyOwner returns (Package memory) {
    for (uint i = 0; i < packages.length; i++) {
      if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
        return packages[i];
      }
    }
    revert("Package not found");
  }


    // START OF FUNCTIONS TO HANDLE CONTRACT FUNDING

    // Fallback function allows the contract to receive Ether
    function() external payable {
    }

    // Function to allow the owner to send funds to the contract
    function fundContract() external payable onlyOwner {
        require(msg.value > 0, "Sent value must be greater than 0");
        emit Funded(msg.sender, msg.value);
    }
}
