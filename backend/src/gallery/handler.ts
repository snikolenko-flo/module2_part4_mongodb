import * as dotenv from 'dotenv';
dotenv.config();
import { GalleryManager } from './gallery.manager.js';
import { UrlService } from '../services/url.service.js';
import { log } from '../helper/logger.js';
import { Request, Response } from 'express';
import { DbService } from '../services/db-service.js';

const manager = new GalleryManager();
const urlService = new UrlService();
const dbService = new DbService();
const IMAGES_DIR = process.env.IMAGES_DIR;

export async function getGallery(req: Request, res: Response) {

  const pageNumber = urlService.getPageNumber(req);
  const pageLimit = urlService.getPageLimit(req);

  if (isNaN(pageNumber)) return manager.error.sendIsNanError(res);
  if (!isFinite(pageNumber)) return manager.error.sendFiniteError(res);

  const total = await manager.file.getTotalPages(IMAGES_DIR);
  const totalForLimit = await manager.file.getTotalPagesForLimit(IMAGES_DIR, pageLimit);

  if (pageNumber > total || pageNumber <= 0) return manager.error.sendWrongPageError(res, total);
  log.info(`The page number ${pageNumber} is ok.`);

  if (pageNumber > totalForLimit || pageNumber <= 0) return manager.error.sendWrongPageError(res, totalForLimit);
  log.info(`The page number ${pageNumber} is ok.`);

  let pagesAmount = await manager.file.getPagesAmount(IMAGES_DIR, pageLimit);
  if (pagesAmount > total) pagesAmount = total;

  const imagesPaths = await dbService.getImages(pageNumber, pageLimit);
  manager.response.sendImages(res, pagesAmount, imagesPaths);
}
