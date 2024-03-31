
import { graphql } from 'graphql';
import schema from '@/Schema/schema'; // Import your existing GraphQL schema
import ConnectDB from '@/Database';


export const POST = async(req: Request) => {
    try {
        // Execute the GraphQL query against the schema
        const {source,variableValues} = await req.json()

        await ConnectDB();

        const result = await graphql({
            schema,
            // GraphQL query
            source, 
            variableValues
        });

        // Check for errors
        if (result.errors) {
            return new Response(JSON.stringify({ errors: result.errors }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Return the result
        return new Response(JSON.stringify({ data: result.data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle any unexpected errors
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
