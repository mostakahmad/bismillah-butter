// import { Request } from 'express';
import { Request } from 'express';

interface FilterOptions {
    queries: {
        sortBy?: string;
        fields?: string;
        skip?: number;
        limit?: number;
    };
    filters: Record<string, unknown>;
}

export const filterOption = (options: Request): FilterOptions => {
    const { query } = options;

    // Create a new object to avoid mutating the original object
    const filters: Record<string, unknown> = { ...query };

    // Exclude certain fields from the filters object
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((field) => delete filters[field]);

    // Use a library like `mongodb` or `mongoose` to parse filters
    console.log({ filters });
    const parsedFilters = JSON.parse(JSON.stringify(filters).replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`));

    console.log( parsedFilters );

    // Use type annotations for the queries object
    const queries: FilterOptions['queries'] = {};

    if (query.sort) {
        // Use a more descriptive variable name
        const sortBy: string = (query.sort as string).split(',').join(' ');
        queries.sortBy = sortBy;
    }

    if (query.fields) {
        // Use a more descriptive variable name
        const fields: string = (query.fields as string).split(',').join(' ');
        queries.fields = fields;
    }

    if (query.page) {
        // Use destructuring to extract the `page` and `limit` properties
        const { page = 1, limit = 10 } = query;

        // Use type annotations for `skip` and `limit`
        const skip: number = (parseInt(page as string) - 1) * parseInt(limit as string, 10);
        queries.skip = skip;
        queries.limit = parseInt(limit as string, 10);
    }

    return { queries, filters: parsedFilters };
};
