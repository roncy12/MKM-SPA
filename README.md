
# Foundry Theme

Foundry is a boutique theme built on Bigcommerce's new merchant platform.

### Installation

```
$ git clone git@bitbucket.org:pixelunion/foundry-bc.git
$ cd foundry-bc
$ npm install
$ jspm install
$ stencil init
$ stencil start
```

#### What is not working

* Checking out
* Product page price/details updating when variations are selected
* Product page videos
* Gift certificates
* Product page image zoom
* **Anything to do with the forthcoming theme editor (includes extra footer columns, instagram feed settings, any display settings, colours...)**

#### Known bugs

* Currency converter not working with Cart Preview
* Increasing the product quantity before adding to cart does not apply
* Faceted search options need mobile toggle
* Ajax product pagination broken
* Product compare and sorting fail after faceted search is initialized
