// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Shipment {
  enum DeliveryStatus { SHIPPED, DELIVERED }

  struct Package {
    string packageId;
    DeliveryStatus status;
    address sender;
    address receiver;
    uint256 amount;
  }

  //mapping(string => Package) packages;
  Package[] packages;

  event PackageCreated(string packageId, address sender, address receiver, uint256 value);
  event DeliveryStatusUpdated(string packageId, DeliveryStatus status);
  event PackageDelivered(string packageId, address sender, uint256 amount);

  // This modifier is required so that only the owners of the contract can access informations about packages that are shipped
   modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can call this function");
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  // This function is called to save a newly-shipped package on chain. 
  function shipPackage(string memory _packageId, address _receiver, uint256 _amount) public {
      Package memory newPackage = Package(_packageId, DeliveryStatus.SHIPPED, msg.sender, _receiver, _amount);
      packages.push(newPackage);
      emit PackageCreated(_packageId, msg.sender, _receiver, _amount);
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

  // Function responsible for package delivery and payouts
  function deliverPackage(string memory _packageId) public {
    for (uint i = 0; i < packages.length; i++) {
      if (keccak256(abi.encodePacked(packages[i].packageId)) == keccak256(abi.encodePacked(_packageId))) {
        require(msg.sender == packages[i].receiver, "Only the receiver can mark the package as delivered");
        require(packages[i].status != DeliveryStatus.DELIVERED, "Package has already been delivered");
        
        // Transfer amount to sender
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

}
