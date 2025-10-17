import {
    mapProjectTypeToResourceUrl,
} from "../../helpers/helpers";
import {useEffect, useState} from "react";
import ListItemPlaceholder from "../ListItemPlaceholder";
import Cookies from "js-cookie";
import {
    QrCentraalCooKieAccessToken,
    QrCentraalOrgId,
} from "../../utils/cookie";
import {projectApi} from "../../qrcode_api";
import Link from "next/link";

const MyQrCodesList = ({result}) => {
    const [currentPage, setCurrentPage] = useState(result.currentPage);
    const [totalPages, setTotalPages] = useState(result.totalPages);
    const [totalItems, setTotalItems] = useState(result.totalItems);
    const [isLoading, setIsLoading] = useState(true);
    const [hasPreviousPage, setHasPreviousPage] = useState(currentPage > 0);
    const [hasNextPage, setHasNextPage] = useState(currentPage < totalPages - 1);
    const [pages, setPages] = useState([]);
    const [accessToken, setAccessToken] = useState(
        Cookies.get(QrCentraalCooKieAccessToken)
    );
    const [projects, setProjects] = useState(result.projects);
    const [limit, setLimit] = useState(result.limit);
    const [organizationId, setOrganizationId] = useState(
        Cookies.get(QrCentraalOrgId)
    );

    useEffect(() => {
        setIsLoading(false);

        let list = [];
        for (let i = 1; i <= totalPages; i++) {
            list.push(i);
        }
        setPages(list);
    }, [projects]);

    const loadItems = (nextPage) => {
        if (nextPage < 0 || nextPage > totalPages) {
            return;
        }

        setCurrentPage(nextPage);
    };

    useEffect(() => {
        if (organizationId) {
            setHasPreviousPage(currentPage > 0);
            setHasNextPage(currentPage < totalPages - 1);
            setIsLoading(true);

            let projectClient = projectApi(accessToken);
            projectClient
                .listProjects(organizationId, {
                    currentPage: currentPage,
                    perPage: limit,
                    query: "",
                })
                .then((response) => {
                    setProjects(
                        response.data.items.map((p) => ({
                            ...p,
                            created_at: new Date(p.created_at).toISOString(),
                        }))
                    );
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsLoading(false);
                });
        }
    }, [currentPage, organizationId]);

    return (
        <>
            <div className="page-wrapper">
                <div className="page-body">
                    <div className="container-xl">
                        <div className="row row-cards">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">My Projects</h3>
                                    </div>
                                    {isLoading && (
                                        <div className="table-responsive w-100 text-center">
                                            <ListItemPlaceholder/>
                                        </div>
                                    )}

                                    {!isLoading && (
                                        <div className="table-responsive qrcentral-table">
                                            <table className="table card-table table-vcenter text-nowrap datatable">
                                                <thead className="d-none d-md-table-header-group">
                                                <tr>
                                                    <th className="w-1">
                                                        <input
                                                            className="form-check-input m-0 align-middle"
                                                            type="checkbox"
                                                            aria-label="Select all invoices"
                                                        />
                                                    </th>
                                                    <th>Name</th>
                                                    <th>Type</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                {projects &&
                                                    projects.length > 0 ?
                                                    projects.map((project) => (
                                                        <tr key={project.id}>
                                                            <td>
                                                                <input
                                                                    className="form-check-input m-0 align-middle"
                                                                    type="checkbox"
                                                                    aria-label="Select project"
                                                                />
                                                            </td>
                                                            <td data-header="Name">
                                                                <div className="d-flex align-items-center">
                                                                    <Link
                                                                        href={`/${mapProjectTypeToResourceUrl(
                                                                            project.type
                                                                        )}/${project.id}`}
                                                                        className="text-reset"
                                                                        tabIndex="-1"
                                                                    >
                                                                        {project.name}
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                            <td data-header="Type">
                                                                <div className="d-flex align-items-center">
                                                                    {project.type}
                                                                </div>
                                                            </td>
                                                            <td data-header="Status">
                                                                <div className="d-flex align-items-center">
                                                                    Active
                                                                </div>
                                                            </td>
                                                            <td
                                                                data-header="Actions"
                                                                className="text-start d-flex justify-content-md-end">
                                                                <div
                                                                    className="d-flex flex-wrap align-items-center gap-2">
                                                                    <Link
                                                                        className="btn btn-outline-success"
                                                                        href={`/${mapProjectTypeToResourceUrl(
                                                                            project.type
                                                                        )}/${project.id}`}>
                                                                        Edit
                                                                    </Link>

                                                                    <Link
                                                                        className="btn btn-primary"
                                                                        href={`/dashboard/qr-codes/${project.id}/configure`}>
                                                                        Generate QR
                                                                    </Link>

                                                                    <Link
                                                                        className="btn btn-outline-teal"
                                                                        href={`/dashboard/qr-codes/${project.id}/analytics`}>
                                                                        Analytics
                                                                    </Link>

                                                                    <Link
                                                                        className="btn btn-outline-teal"
                                                                        href={`/dashboard/projects/${project.id}/update`}>
                                                                        Settings
                                                                    </Link>

                                                                    <Link className="btn btn-danger" href="#">
                                                                        Delete
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )):<tr>
                                                <td colSpan="5" className="text-muted py-4">
                                                 No projects found.
                                               </td>
                                                </tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {!isLoading && (
                                        <div className="card-footer d-flex align-items-center">
                                            <p className="m-0 text-secondary">
                                                Showing <span>{currentPage * limit + 1}</span> to{" "}
                                                <span>
                          {currentPage * limit + limit < totalItems
                              ? currentPage * limit + limit
                              : totalItems}
                        </span>{" "}
                                                of <span>{totalItems}</span> items
                                            </p>
                                            <ul className="pagination m-0 ms-auto">
                                                <li
                                                    className={
                                                        hasPreviousPage ? "page-item" : "page-item disabled"
                                                    }>
                                                    <button
                                                        disabled={!hasPreviousPage}
                                                        className="page-link"
                                                        tabIndex="-1"
                                                        onClick={() => {
                                                            loadItems(currentPage - 1);
                                                        }}>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="icon"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round">
                                                            <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                            />
                                                            <path d="M15 6l-6 6l6 6"/>
                                                        </svg>
                                                        Prev
                                                    </button>
                                                </li>
                                                {pages &&
                                                    pages.map((page) => (
                                                        <li className="page-item" key={page}>
                                                            <button
                                                                onClick={() => loadItems(page - 1)}
                                                                className={
                                                                    currentPage + 1 === page
                                                                        ? "page-link active"
                                                                        : "page-link"
                                                                }>
                                                                {page}
                                                            </button>
                                                        </li>
                                                    ))}
                                                <li
                                                    className={
                                                        hasNextPage ? "page-item" : "page-item disabled"
                                                    }
                                                >
                                                    <button
                                                        onClick={() => {
                                                            loadItems(currentPage + 1);
                                                        }}
                                                        className="page-link"
                                                        disabled={!hasNextPage}
                                                    >
                                                        Next
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="icon"
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth="2"
                                                            stroke="currentColor"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path
                                                                stroke="none"
                                                                d="M0 0h24v24H0z"
                                                                fill="none"
                                                            />
                                                            <path d="M9 6l6 6l-6 6"/>
                                                        </svg>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyQrCodesList;
