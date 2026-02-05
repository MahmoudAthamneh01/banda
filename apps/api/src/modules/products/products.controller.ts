import { Request, Response } from 'express';
import { z } from 'zod';

const ImportSchema = z.object({
    url: z.string().url(),
});

export const importProduct = async (req: Request, res: Response) => {
    try {
        const { url } = ImportSchema.parse(req.body);

        // Mock Scraper Delay
        // await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock Data Return
        const mockProduct = {
            name: 'High Quality Wireless Headphones Noise Cancelling',
            price: '145.00',
            moq: 500,
            sku: 'BANDA-XE9-2024',
            supplier: 'Shenzhen Tech Factory',
            images: []
        };

        res.json(mockProduct);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Invalid URL', details: error.errors });
        }
        res.status(500).json({ error: 'Import failed' });
    }
};

export const getFeed = async (req: Request, res: Response) => {
    // Mock "Sovereign Boxes" (Live Investment Opportunities)
    const feed = [
        {
            id: 'box-1',
            title: 'Wireless Audio Batch #240',
            roi: 12.5,
            duration: '45 Days',
            progress: 65,
            targetAmount: 50000,
            image: '/mock/headphones.jpg',
            maker: 'AudioTech Ltd',
            tags: ['Electronics', 'High Yield']
        },
        {
            id: 'box-2',
            title: 'Eco-Friendly Bamboo Cutlery',
            roi: 8.2,
            duration: '30 Days',
            progress: 90,
            targetAmount: 20000,
            image: '/mock/bamboo.jpg',
            maker: 'GreenLiving',
            tags: ['Eco', 'Fast Turnaround']
        },
        {
            id: 'box-3',
            title: 'Smart Home LED Strips',
            roi: 15.0,
            duration: '60 Days',
            progress: 20,
            targetAmount: 100000,
            image: '/mock/led.jpg',
            maker: 'BrightFuture',
            tags: ['Home', 'Smart Tech']
        }
    ];

    res.json(feed);
};
