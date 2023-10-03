declare namespace Items {
    type LinkData = {
        name: string;
        link: string;
        code: strin;
    }
    type ItemData = {
        id:  number;
        name: string;
        code: string;
        type: string;
        links: LinkData[];
        images: string[];
    }

    type Types = {
        id: number;
        name: string;
        code: string;
        color: string;
    }

    type Items = Api.Pagination & { data: ItemData[] }
}