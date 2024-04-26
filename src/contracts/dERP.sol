// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract dERP{
    address owner;

    constructor(){
        owner=msg.sender;
        roles[msg.sender]="Admin";
    }

    //-------------Roles assigning----------
    mapping (address => string) roles;

    event RoleAssigned(address indexed addr, string indexed role);

    // modifier checkRole(address _addr){  //to not assign role again, once role is there, it is fixed
    //     require(keccak256(abi.encodePacked(roles[_addr])) == keccak256(abi.encodePacked("None")), "Role already assigned");
    //     _;
    // }

    modifier onlyOwner(address _addr){
        require(_addr == owner, "Only owner can assign the role");
        _;
    }
    //to get the role
    function getRole() public view returns (string memory){  //to get the role of the current user
        if(keccak256(abi.encodePacked(roles[msg.sender])) == keccak256(abi.encodePacked(""))) return "None";
        return roles[msg.sender];
    }

    function addRole(string memory _role, address _addr) public onlyOwner(msg.sender){  //to assign a role for first time
        roles[_addr]=_role;
        emit RoleAssigned(_addr, _role);
    }

    function removeRole(address _addr) public onlyOwner(msg.sender){
        roles[_addr]="None";
        emit RoleAssigned(_addr, "None");
    }

    //--------Supply Chain----------
    
    struct Product {
        address manufacturer;
        address distributor;
        address retailer;
        string productName;
        uint256 productAmount;
        uint256 productId;
        string status;
        uint256 money;
        uint256 time;
    }

    mapping(uint256 => Product[]) public supplyHistory; 
    //mapping(address => Product[]) public statusOfAllProducts;
    mapping(uint256 => Product) public products;
    uint256 public productCount=1;

    event OnSale(uint256 indexed productId, address indexed addr, string role);
    event Paid(uint256 indexed productId, address indexed addr, string role);
    event Shipped(uint256 indexed productId, address indexed addr, string role);
    event Received(uint256 indexed productId, address indexed addr, string role);

    //modifiers to check which role can run which function
    modifier onlyManufacturer(address _addr) {
        require(keccak256(abi.encodePacked(roles[_addr])) == keccak256(abi.encodePacked("Manufacturer")), "Only manufacturer can call this function");
        _;
    }

    modifier onlyDistributor(address _addr) {
        require(keccak256(abi.encodePacked(roles[_addr])) == keccak256(abi.encodePacked("Distributor")), "Only distributor can call this function");
        _;
    }

    modifier onlyRetailer(address _addr) {
        require(keccak256(abi.encodePacked(roles[_addr])) == keccak256(abi.encodePacked("Retailer")), "Only retailer can call this function");
        _;
    }

    //modifier to check if correct amount is sent, and not less
    modifier checkPayment(uint256 amount, uint256 price){
        require(amount >= price, "Amount sent is less, retry again");
        _;
    }



    //manufacturer creates product to sell to distributor
    function createProduct(string memory _name, uint256 _money, uint256 _productAmount) public onlyManufacturer(msg.sender){
        uint256 productId = productCount++;
        products[productId] = Product({
            manufacturer: msg.sender,
            distributor: address(0),
            retailer: address(0),
            productName: _name,
            productAmount: _productAmount,
            productId: productId,
            status: "On Sale By Manufacturer",
            money: _money,
            time: block.timestamp
        });
        supplyHistory[productId].push(products[productId]);
        emit OnSale(productId, msg.sender, roles[msg.sender]);
    }

    //distributor buys the product of the manufacturer
    modifier checkForCreateProduct(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("On Sale By Manufacturer")), "Manufacturer has not put this product on sale, please wait");
        _;
    }

    function PayByDistributor(uint256 productId, address payable _manufacturer) public payable 
        onlyDistributor(msg.sender) 
        checkPayment(msg.value, products[productId].money)
        checkForCreateProduct(products[productId].status)
    {
        products[productId].distributor=msg.sender;
        products[productId].status = "Paid by Distributor to Manufacturer";
        products[productId].time=block.timestamp;
        _manufacturer.transfer(products[productId].money);
        payable(msg.sender).transfer(msg.value - products[productId].money);
        supplyHistory[productId].push(products[productId]);
        emit Paid(productId, msg.sender, roles[msg.sender]);
    }

    //manufacturer ships the product
    modifier checkForPaymentByDistributor(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Paid by Distributor to Manufacturer")), "Let the distributor pay first, then ship the product");
        _;
    }

    function shippedFromManufacturer(uint productId) public 
        onlyManufacturer(msg.sender) 
        checkForPaymentByDistributor(products[productId].status)
    {
        products[productId].status = "Shipped from Manufacturer";
        products[productId].time=block.timestamp;
        supplyHistory[productId].push(products[productId]);
        emit Shipped(productId, msg.sender, roles[msg.sender]);
    }

    //distributor receives the product
    modifier checkForShipmentByManufacturer(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Shipped from Manufacturer")), "Let the manufacturer ship the product");
        _;
    }

    function ReceivedToDistributor(uint productId) public 
        onlyDistributor(msg.sender)
        checkForShipmentByManufacturer(products[productId].status)
    {
        products[productId].status = "Received To Distributor";
        products[productId].time=block.timestamp;
        supplyHistory[productId].push(products[productId]);
        emit Received(productId, msg.sender, roles[msg.sender]);
    }

    //distributor sells product to the retailer for a higher price
    modifier checkForReceiveOfProduct(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Received To Distributor")), "Product has not been received, you cannot put the product on sale");
        _;
    }

    function onSaleByDistributor(uint256 productId, uint256 _money) public 
        onlyDistributor(msg.sender)
        checkForReceiveOfProduct(products[productId].status)
    {
        products[productId].status = "On Sale by Distributor";
        products[productId].money=_money;
        products[productId].time=block.timestamp;
        supplyHistory[productId].push(products[productId]);
        emit OnSale(productId, msg.sender, roles[msg.sender]);
    }

    //retailer pays for the price
    modifier checkForSaleByDistributor(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("On Sale by Distributor")), "Product is not on sale yet, please wait");
        _;
    }

    function PayByRetailer(uint256 productId, address payable _distributor) public payable
        onlyRetailer(msg.sender) 
        checkPayment(msg.value, products[productId].money)
        checkForSaleByDistributor(products[productId].status)
    {
        products[productId].retailer=msg.sender;
        products[productId].status = "Paid by Retailer to Distributor";
        products[productId].time=block.timestamp;
        _distributor.transfer(products[productId].money);
        payable(msg.sender).transfer(msg.value - products[productId].money);
        supplyHistory[productId].push(products[productId]);
        emit Paid(productId, msg.sender, roles[msg.sender]);
    }

    //distributor ships the product
    modifier checkForPaidByRetailer(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Paid by Retailer to Distributor")), "Let the product be paid by the retailer");
        _;
    }

    function shippedFromDistributor(uint productId) public 
        onlyDistributor(msg.sender)
        checkForPaidByRetailer(products[productId].status)
    {
        products[productId].status = "Shipped from Distributor";
        products[productId].time=block.timestamp;
        supplyHistory[productId].push(products[productId]);
        emit Shipped(productId, msg.sender, roles[msg.sender]);
    }

    //retailer receives the product
    modifier checkForShippedByDistributor(string memory status){
        require(keccak256(abi.encodePacked(status)) == keccak256(abi.encodePacked("Shipped from Distributor")), "Distributor has not shipped the product yet");
        _;
    }

    function ReceivedToRetailer(uint productId) public 
        onlyRetailer(msg.sender)
        checkForShippedByDistributor(products[productId].status)
    {
        products[productId].status = "Received To Retailer";
        products[productId].time=block.timestamp;
        supplyHistory[productId].push(products[productId]);
        emit Received(productId, msg.sender, roles[msg.sender]);
    }

    // to get the details of the product
    function getProductData(uint256 productId) public view returns (Product memory) {
        return products[productId];
    }

    //to get the history
    function getSupplyHistory(uint256 productId) public view returns(Product[] memory){
        return supplyHistory[productId];
    }

    //to get status of all products
    function getStatusOfAllProducts(address _addr, string memory _role) public view returns(Product[] memory){
        uint cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Manufacturer"))){
                if(products[i].manufacturer==_addr){
                    cnt++;
                }
            }
            else if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Distributor"))){
                if(products[i].distributor==_addr){
                    cnt++;
                }
            }
            else if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Retailer"))){
                if(products[i].retailer==_addr){
                    cnt++;
                }
            }
        }
        Product[] memory statusOfAll = new Product[](cnt);
        cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Manufacturer"))){
                if(products[i].manufacturer==_addr){
                    statusOfAll[cnt]=products[i];
                    cnt++;
                }
            }
            else if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Distributor"))){
                if(products[i].distributor==_addr){
                    statusOfAll[cnt]=products[i];
                    cnt++;
                }
            }
            else if(keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("Retailer"))){
                if(products[i].retailer==_addr){
                    statusOfAll[cnt]=products[i];
                    cnt++;
                }
            }
        }
        return statusOfAll;
    }

    //display all products of manufacturer to only distributor
    function allProductsOfManufacturer() public view onlyDistributor(msg.sender) returns(Product[] memory){
        uint cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(products[i].status)) == keccak256(abi.encodePacked("On Sale By Manufacturer"))){
                cnt++;
            }
        }
        Product[] memory allProducts = new Product[](cnt);
        cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(products[i].status)) == keccak256(abi.encodePacked("On Sale By Manufacturer"))){
                allProducts[cnt]=products[i];
                cnt++;
            }
        }
        return allProducts;
    }

    //display all products of distributor to only retailer
    function allProductsOfDistributor() public view onlyRetailer(msg.sender) returns(Product[] memory){
        uint cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(products[i].status)) == keccak256(abi.encodePacked("On Sale by Distributor"))){
                cnt++;
            }
        }
        Product[] memory allProducts = new Product[](cnt);
        cnt=0;
        for(uint i=1; i<productCount; i++){
            if(products[i].manufacturer == address(0)) continue;
            if(keccak256(abi.encodePacked(products[i].status)) == keccak256(abi.encodePacked("On Sale by Distributor"))){
                allProducts[cnt]=products[i];
                cnt++;
            }
        }
        return allProducts;
    }

}