import findDuplicateStrings from "@/lib/findDuplicateStrings";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {const names = await prisma.student.findMany({
        select:{
            name: true
        }
     });
    
     const duplicateNames = findDuplicateStrings(names.map(student => student.name));
    
    return new Response(JSON.stringify(duplicateNames), { status: 200 });
    }
    catch(error){
        return new Response(JSON.stringify(error), { status: 500 });
    }
}

