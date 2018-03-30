import '../../bootstrap';

import {WaJsonApiNormalizer} from '../../../src';
import {expect} from 'chai';


let normalizer: WaJsonApiNormalizer;


describe('#Normalizer/WaJsonApiNormalizer', () => {

	beforeEach(() => {
		normalizer = new WaJsonApiNormalizer;
	});

	describe('normalizeItem()', () => {

		it('should normalize simple item with attributes', () => {
			expect(normalizer.normalizeItem({
				data: {
					type: 'user',
					id: 1,
					attributes: {
						name: 'John Doe',
						email: 'john@doe.com',
					},
					relationships: {},
				},
			})).to.be.eql({
				type: 'user',
				id: 1,
				data: {
					name: 'John Doe',
					email: 'john@doe.com',
				},
				relationships: {},
			});
		});

		it('should normalize not existing relationship', () => {
			expect(normalizer.normalizeItem({
				data: {
					type: 'user',
					id: 1,
					attributes: {},
					relationships: {
						role: {
							data: null,
						},
					},
				},
			})).to.be.eql({
				type: 'user',
				id: 1,
				data: {},
				relationships: {
					role: null,
				},
			});
		});

		it('should throw an error if relation is missing', () => {
			expect(() => {
				normalizer.normalizeItem({
					data: {
						type: 'user',
						id: 1,
						attributes: {},
						relationships: {
							role: {
								data: {
									type: 'role',
									id: 1,
								},
							},
						},
					},
				});
			}).to.throw(Error, 'Missing relationship role:1');
		});

		it('should normalize simple relationship', () => {
			expect(normalizer.normalizeItem({
				data: {
					type: 'user',
					id: 1,
					attributes: {},
					relationships: {
						role: {
							data: {
								type: 'role',
								id: 1,
							},
						},
					},
				},
				included: [
					{
						type: 'role',
						id: 1,
						attributes: {},
						relationships: {},
					},
				],
			})).to.be.eql({
				type: 'user',
				id: 1,
				data: {},
				relationships: {
					role: {
						type: 'role',
						id: 1,
						data: {},
						relationships: {},
					},
				},
			});
		});

		it('should normalize array relationship', () => {
			expect(normalizer.normalizeItem({
				data: {
					type: 'user',
					id: 1,
					attributes: {},
					relationships: {
						roles: {
							data: [
								{
									type: 'role',
									id: 1,
								},
								{
									type: 'role',
									id: 2,
								},
							],
						},
					},
				},
				included: [
					{
						type: 'role',
						id: 1,
						attributes: {},
						relationships: {},
					},
					{
						type: 'role',
						id: 2,
						attributes: {},
						relationships: {},
					},
				],
			})).to.be.eql({
				type: 'user',
				id: 1,
				data: {},
				relationships: {
					roles: [
						{
							type: 'role',
							id: 1,
							data: {},
							relationships: {},
						},
						{
							type: 'role',
							id: 2,
							data: {},
							relationships: {},
						},
					],
				},
			});
		});

	});

	describe('normalizeCollection()', () => {

		it('should normalize array of items', () => {
			expect(normalizer.normalizeCollection({
				data: [
					{
						type: 'user',
						id: 1,
						attributes: {
							name: 'John Doe',
							email: 'john@doe.com',
						},
						relationships: {},
					},
				],
			})).to.be.eql([
				{
					type: 'user',
					id: 1,
					data: {
						name: 'John Doe',
						email: 'john@doe.com',
					},
					relationships: {},
				},
			]);
		});

	});

	describe('normalize()', () => {

		it('should normalize item', () => {
			expect(normalizer.normalize({
				data: {
					type: 'user',
					id: 1,
					attributes: {
						name: 'John Doe',
						email: 'john@doe.com',
					},
					relationships: {},
				},
			})).to.be.eql({
				type: 'user',
				id: 1,
				data: {
					name: 'John Doe',
					email: 'john@doe.com',
				},
				relationships: {},
			});
		});

		it('should normalize collection', () => {
			expect(normalizer.normalize({
				data: [
					{
						type: 'user',
						id: 1,
						attributes: {
							name: 'John Doe',
							email: 'john@doe.com',
						},
						relationships: {},
					},
				],
			})).to.be.eql([
				{
					type: 'user',
					id: 1,
					data: {
						name: 'John Doe',
						email: 'john@doe.com',
					},
					relationships: {},
				},
			]);
		});

	});

});
