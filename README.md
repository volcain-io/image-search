# image-search
Image Search Abstraction Layer based on Node.js/Express/MongoDB

1) I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
2) I can paginate through the responses by adding a ?offset=2 parameter to the URL.
3) I can get a list of the most recently submitted search strings.

Example usage:
```
https://desolate-sands-21254.herokuapp.com/{searchTerm}?offset={offsetIndex}

searchTerm : Grumpy Cat // search query
offsetIndex: 20 // index you want to offset from
```

Example output:
```
[
    {
        "url" : "http://data.whicdn.com/images/28614985/original.jpg",
        "snippet" : "Lolcats - Funny Pictures of ...",
        "thumbnail" : "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ6dpfl378CcSGGvqS-MmPa91qcMfB31WYmW_1ARakW5jQ7-jUhTCvWuYo",
        "context" : "http://weheartit.com/entry/group/15377825"
    }, ...
]
```

To browse recent search queries (max. 10 entries):
```
https://desolate-sands-21254.herokuapp.com/latest
```

Example output:
```
[
    {
        "term" : "lolcats funny",
        "when" : "2017-03-21T13:41:23.310Z"
    }, ...
]
```
