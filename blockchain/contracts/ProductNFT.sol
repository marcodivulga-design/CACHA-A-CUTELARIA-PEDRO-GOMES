// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ProductNFT
 * @dev NFT contract for Cachaca e Cutelaria products
 */
contract ProductNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // Product metadata
    struct Product {
        string productId;
        string name;
        string description;
        uint256 price;
        address creator;
        uint256 createdAt;
        bool isLimited;
        uint256 limitedEditionNumber;
        string ipfsHash;
    }

    // Mapping from token ID to product
    mapping(uint256 => Product) public products;

    // Mapping from product ID to token ID
    mapping(string => uint256) public productIdToTokenId;

    // Events
    event ProductNFTMinted(
        uint256 indexed tokenId,
        string productId,
        address indexed creator,
        string ipfsHash
    );

    event ProductNFTBurned(uint256 indexed tokenId);

    event ProductNFTTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("Cachaca Cutelaria NFT", "CCNFT") {}

    /**
     * @dev Mint a new product NFT
     */
    function mintProductNFT(
        string memory productId,
        string memory name,
        string memory description,
        uint256 price,
        bool isLimited,
        uint256 limitedEditionNumber,
        string memory ipfsHash,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Create product
        Product memory product = Product({
            productId: productId,
            name: name,
            description: description,
            price: price,
            creator: msg.sender,
            createdAt: block.timestamp,
            isLimited: isLimited,
            limitedEditionNumber: limitedEditionNumber,
            ipfsHash: ipfsHash
        });

        products[tokenId] = product;
        productIdToTokenId[productId] = tokenId;

        // Mint NFT
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit ProductNFTMinted(tokenId, productId, msg.sender, ipfsHash);

        return tokenId;
    }

    /**
     * @dev Burn a product NFT
     */
    function burnProductNFT(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == msg.sender || msg.sender == owner(),
            "Only owner can burn"
        );

        _burn(tokenId);
        emit ProductNFTBurned(tokenId);
    }

    /**
     * @dev Get product details
     */
    function getProduct(uint256 tokenId)
        public
        view
        returns (Product memory)
    {
        require(_exists(tokenId), "Product does not exist");
        return products[tokenId];
    }

    /**
     * @dev Get token ID by product ID
     */
    function getTokenIdByProductId(string memory productId)
        public
        view
        returns (uint256)
    {
        return productIdToTokenId[productId];
    }

    /**
     * @dev Check if product NFT exists
     */
    function productExists(string memory productId) public view returns (bool) {
        uint256 tokenId = productIdToTokenId[productId];
        return _exists(tokenId);
    }

    /**
     * @dev Override required functions
     */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
