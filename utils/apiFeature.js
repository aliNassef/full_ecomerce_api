class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    filter() {
        const queryStringObject = { ...this.queryString };
        const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
        excludedFields.forEach((field) => delete queryStringObject[field]);
        let query = JSON.stringify(queryStringObject);
        query = query.replace(/\b(gt|gte|lt|lte|ne)\b/g, (match) => `$${match}`);
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(query));
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy);
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
        }
        return this;
    }

    paginate(countDocuments) {
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 10;
        const skip = (page - 1) * limit;
        const pagination = {};
        pagination.limit = +limit;
        const endIndex = page * limit;
        pagination.pages = Math.ceil(countDocuments / limit);
        pagination.currentPage = +page;
        if (skip > 0) {
            pagination.prevPage = page - 1;
        } else {
            pagination.prevPage = null;
        }

        if (endIndex < countDocuments) {
            pagination.nextPage = +page + 1;
        } else {
            pagination.nextPage = null;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
        this.paginationResult = pagination;
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v');
        }
        return this;
    }

    search(searchKeys = ['title', 'description']) {
        if (this.queryString.keyword) {
            const query = {
                $or: searchKeys.map((key) => ({
                    [key]: {
                        $regex: this.queryString.keyword,
                        $options: 'i',
                    },
                })),
            };

            this.mongooseQuery = this.mongooseQuery.find(query);
        }

        return this;
    }

    populate(path, select) {
        this.mongooseQuery = this.mongooseQuery.populate(path, select);

        return this;
    }
}


module.exports = ApiFeature;